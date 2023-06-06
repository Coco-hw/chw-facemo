import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

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
  angry: "👿",
  disgusted: "🤢",
  fearful: "😨",
  happy: "😊",
  neutral: "😐",
  sad: "😥",
  surprised: "😲",
};

const Bundle = ({ currentContentId, closeBundle, uploadReply, intervalRef }) => {
  // emoji를 저장할 useState, useRef 선언
  const [currentEmoji, setCurrentEmoji] = useState("");
  const setCurrentEmojiRef = useRef();
  setCurrentEmojiRef.current = setCurrentEmoji;

  // streaming status, reference
  const [isStreaming, setIsStreaming] = useState(true);

  // detecting status, reference
  const [detecting, setDetecting] = useState(true);
  const detectingRef = useRef();
  detectingRef.current = detecting;

  // stoping interval reference
  const stopIntervalRef = useRef();

  // save and upload reply (in index)
  const saveReply = () => {
    // { contentId, replyId, replyEmoji, replyTxt, timestamp }
    uploadReply({
      contentId: currentContentId,
      replyId: Date.now(),
      replyEmoji: currentEmoji,
      replyTxt: "",
      timestamp: Date.now(),
    });
    console.log(currentEmoji);
  };

  // stream and set detect interval
  const streamDetect = async () => {
    // start webcam
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // get video & canvas
    const video = document.getElementById("video");
    video.srcObject = stream;
    const canvas = document.getElementById("canvas");
    
    // get all faceapi models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);

    // detecting video (used in interval)
    const detect = async (video, canvas) => {
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

      if(!videoWidth||!videoHeight){
        return;
      }

      // match canvas dimention with video
      const displaySize = { width: videoWidth, height: videoHeight };

      faceapi.matchDimensions(canvas, displaySize);

      // resize detection according to canvas
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // when detected, clear currentEmojiList
      if(resizedDetections.length) {
        var tempEmoji = ""

        // get emoji and draw rectangle for each face
        resizedDetections.forEach((detection) => {
          // get box dimention
          const box = detection.detection.box;
          // get expressions & emoji
          const expressions = detection.expressions;
          const emoji = mapEmoji[biggestOf(expressions)]
          // update tempEmoji
          tempEmoji += emoji;
          
          // draw rectangles
          context.strokeStyle = "white";
          context.lineWidth = 5.0;
          context.rect(box.x, box.y, box.width, box.height);
          context.stroke();
          // draw emoji
          context.font = "50px Arial";
          context.fillText(
            emoji,
            box.x + box.width / 2 - 25,
            box.y - 20
          );
        });
        // set currentEmoji to emojis(in string format)
        setCurrentEmojiRef.current(tempEmoji);
      }
    }

    const stopInterval = () => {
      clearInterval(intervalRef.current);
    }
    stopIntervalRef.current = stopInterval;

    // while video is playing
    video.addEventListener("play", async () => {
      intervalRef.current = setInterval(async () => {
        console.log("interval on");
        detect(video, canvas);
      }, 100);
    });
  };

  // activate streamDetact when first rendered
  useEffect(() => {
    streamDetect();
  }, []);

  const stopVideo = () => {
    // pause video
    const video = document.getElementById("video");
    video.pause();
    // set current streaming status: false
    setIsStreaming(false);
  };

  const restartVideo = () => {
    // restart detecting
    streamDetect();
    // set current streaming status: true
    setIsStreaming(true);
  };

  const savePhoto = () => {
    // stop detecting
    setDetecting(false);
    // delete track
    const video = document.getElementById("video");
    try {
      const tracks = video.srcObject.getTracks();
      tracks[0].stop();
    } catch (error) {
      console.log("Error accessing the camera: " + error);
    }

    // save reply and close bundle
    saveReply();
    closeBundle();
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <canvas id="canvas" className="bg-transparent absolute"/>
      <video id="video" autoPlay/>
      <div>
        {isStreaming
        ? <div>
          <button onClick={stopVideo}>This emoji!</button>
          <button onClick={closeBundle}>Return to emojiList</button>
          </div>
        : <div>
          <button onClick={restartVideo}>Try Again</button>
          <button onClick={savePhoto}>OK</button>
          </div>
        }
      </div>
    </div>
  )
}

export default Bundle;
