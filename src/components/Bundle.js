import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@material-tailwind/react";

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

const Bundle = ({
  closeBundle,
  setCurrentEmojiRef,
  saveReply,
  inputTxt,
  setInputTxt,
  intervalRef,
  stopInterval,
  videoRef,
}) => {
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
  const [emojiAlert, setEmojiAlert] = useState(false);

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

    // if not detected:
    if (!resizedDetections.length){
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
    console.log(tempEmoji);
    setCurrentEmojiRef.current(tempEmoji);
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
    console.log("useEffect");
    streamDetect();
  }, []);

  const pauseVideo = () => {
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

  const savePhoto = () => {
    // save reply and close bundle
    saveReply();
    closeBundle();
  };

  return (
    <div className="flex flex-col w-full h-full flex items-center justify-center bg-gray-200">
      <div>
        <canvas id="canvas" className="bg-transparent absolute" />
        <video id="video" ref={videoRef} autoPlay />
      </div>
      {isStreaming ? (
        <div className="w-full flex flex-row justify-around">
          <Button className="basis-1/2" color="white" onClick={pauseVideo}>
            This emoji!
          </Button>
          <Button className="basis-1/2" color="white" onClick={closeBundle}>
            Return to emojiList
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-row justify-around">
          {/* 댓글을 입력받는 텍스트 필드입니다. */}
          <input
            type="text"
            className="shadow-lg ml-2 p-1 grow mb-4 border border-gray-300 rounded"
            value={inputTxt}
            onChange={(e) => setInputTxt(e.target.value)}
          />
          <Button className="basis-1/3" color="white" onClick={restartVideo}>
            Try Again
          </Button>
          <Button className="basis-1/3" color="white" onClick={savePhoto}>
            OK
          </Button>
        </div>
      )}
    </div>
  );
};

export default Bundle;
