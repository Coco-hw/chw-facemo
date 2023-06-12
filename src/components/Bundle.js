import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import TextBox from "@/components/TextBox";
import EmojiAlert from "@/components/EmojiAlert";
import { Button, Input } from "@material-tailwind/react";
import {
  XMarkIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";

// biggest emotion을 추출할 함수 biggestOf 선언
const biggestOf = (detectedExpressions) => {
  var keys = Object.keys(detectedExpressions);
  var max = keys[0];
  var i;
  for (i = 1; i < keys.length; i++) {
    if (detectedExpressions[keys[i]] > detectedExpressions[max]) {
      max = keys[i];
    }
  }
  return max;
};
// emotion을 emoji로 변환할 오브젝트 mapEmoji 설정
const mapEmoji = {
  angry: "😡",
  disgusted: "🤢",
  fearful: "😨",
  happy: "😊",
  neutral: "😐",
  sad: "😥",
  surprised: "😲",
};
// emotion을 text로 변환할 오브젝트 mapEmoji 설정
const mapTxt = {
  angry: "화나요!",
  disgusted: "싫어요!",
  fearful: "무서워요!",
  happy: "행복해요!",
  neutral: "흠!",
  sad: "슬퍼요..",
  surprised: "깜짝이야!",
};

const Bundle = ({
  closeBundle,
  setCurrentEmojiRef,
  currentEmoji,
  saveReply,
  inputTxt,
  setInputTxt,
  sampleTxt,
  setSampleTxtRef,
  intervalRef,
  stopInterval,
  videoRef,
}) => {
  // 감정에 따른 default 입력값 설정
  const [placeholder, setPlaceholder] = useState("");

  const handleFocus = () => {
    setPlaceholder(sampleTxt);
  };

  const handleBlur = () => {
    setPlaceholder("");
  };

  // streaming status, reference
  const [isStreaming, setIsStreaming] = useState(true);

  // detecting status, reference
  const [detecting, setDetecting] = useState(true);
  const detectingRef = useRef();
  detectingRef.current = detecting;
  // detected status, reference
  const [detected, setDetected] = useState(false);
  const setDetectedRef = useRef();
  setDetectedRef.current = setDetected;

  // emoji alert status
  const [alert, setAlert] = useState(false);

  // text alert status
  const [textAlert, setTextAlert] = useState(false);

  // stop interval reference
  const stopIntervalRef = useRef();
  stopIntervalRef.current = stopInterval;

  // detecting video (used in interval)
  const detect = async (video, canvas) => {
    if (!detectingRef.current) {
      return;
    }
    // set context of canvas
    const context = canvas.getContext("2d");

    // face detection
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // get current (bounding) video dimention
    var videoWidth = video.getBoundingClientRect().width;
    var videoHeight = video.getBoundingClientRect().height;

    if (!videoWidth || !videoHeight) {
      stopInterval();
      return;
    }

    // match canvas dimention with video
    const displaySize = { width: videoWidth, height: videoHeight };

    faceapi.matchDimensions(canvas, displaySize);

    // resize detection according to canvas
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // reset tempEmoji
    var tempEmoji = [];
    var tempTxt = [];

    // if not detected:
    if (!resizedDetections.length) {
      setDetectedRef.current(false);
      return;
    }
    // when detected:
    setDetectedRef.current(true);

    // get emoji and draw rectangle for each face
    resizedDetections.forEach((detection) => {
      // get box dimention
      const box = detection.detection.box;
      // get expressions & emoji
      const expression = biggestOf(detection.expressions);
      // update tempEmoji
      tempEmoji.push(expression);
      tempTxt.push(mapTxt[expression]);

      // draw rectangles
      context.strokeStyle = "white";
      context.lineWidth = 5.0;
      context.rect(box.x, box.y, box.width, box.height);
      context.stroke();
      // draw emoji
      const emoji = mapEmoji[expression];
      context.font = "50px Arial";
      context.fillText(emoji, box.x + box.width / 2 - 25, box.y - 20);
    });
    // set currentEmoji to emojis(in string format)
    setCurrentEmojiRef.current(tempEmoji);
    setSampleTxtRef.current(tempTxt.join(" "));
  };

  // stream and set detect interval
  const streamDetect = async () => {
    // start webcam
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // get all faceapi models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      stopInterval(),
    ]);

    // get video & canvas
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.srcObject = stream;
    const canvas = document.getElementById("canvas");

    // while video is playing
    video.addEventListener("play", async () => {
      setDetecting(true);
      console.log("play");
      intervalRef.current = setInterval(async () => {
        detect(video, canvas);
      }, 100);
    });

    video.addEventListener("pause", async () => {
      stopInterval();
      setDetecting(false);
      console.log("pause");
    });

    video.addEventListener("ended", async () => {
      stopInterval();
      setDetecting(false);
      console.log("ended");
    });
  };

  // activate streamDetact when first rendered & detecting staus becomes true
  useEffect(() => {
    streamDetect();
  }, []);

  useEffect(() => {
    if (detected) {
      setAlert(false);
    }
  }, [detected]);

  const pauseVideo = () => {
    // return none if not detected
    if (!detected) {
      setAlert(true);
      return;
    }
    // stop detecting
    setDetecting(false);
    // pause video
    videoRef.current.pause();
    // stop streaming
    setIsStreaming(false);
  };

  const restartVideo = () => {
    // restart streaming
    videoRef.current.play();
    setIsStreaming(true);
    // restart detecting
    setDetecting(true);
  };

  const savePhoto = async () => {
    // save reply and close bundle
    await saveReply();
    closeBundle();
  };

  return (
    <div className="relative flex flex-col w-full h-full flex items-center justify-center bg-black">
      <div className="">
        <canvas id="canvas" className="bg-transparent absolute" />
        <video id="video" ref={videoRef} className="" autoPlay />
      </div>
      {isStreaming ? (
        <div className="w-full flex flex-row justify-center items-center m-5">
          <Button
            className="flex justify-center items-center p-4"
            color="white"
            onClick={pauseVideo}
            rounded={true}
          >
            <CameraIcon strokeWidth={1} className="h-10 w-10"></CameraIcon>
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-row justify-around items-center p-3 gap-2">
          <Button
            className="flex justify-center item-center"
            color="white"
            onClick={restartVideo}
          >
            <CameraIcon strokeWidth={1} className="h-5 w-5"></CameraIcon>
          </Button>
          <div className="relative w-full">
            {/* 댓글을 입력받는 텍스트 필드입니다. */}
            <Input
              label="무엇을 느꼈나요? (최대 20자)"
              placeholder={placeholder}
              value={inputTxt}
              maxLength={20}
              onChange={(e) => setInputTxt(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="text-white"
            />
            <Button
              size="sm"
              color={"indigo"}
              className="!absolute right-1 top-1 rounded"
              onClick={savePhoto}
            >
              <ChatBubbleLeftIcon
                strokeWidth={1}
                className="h-4 w-4"
              ></ChatBubbleLeftIcon>
            </Button>
          </div>
        </div>
      )}
      <EmojiAlert open={alert} />
    </div>
  );
};

export default Bundle;
