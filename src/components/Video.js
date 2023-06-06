import * as faceapi from "face-api.js";
import { useEffect, useState, useRef } from "react";

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

const Video = ({setCurrentEmoji, saveReply}) => {
  // detected emoji list
  const setCurrentEmojiRef = useRef();
  setCurrentEmojiRef.current = setCurrentEmoji;
  // streaming status
  const [isStreaming, setIsStreaming] = useState(true);
  // isStreaming reference
  const isStreamingRef = useRef();
  isStreamingRef.current = isStreaming;

  // detecting video (used in interval)
  const detect = async (video) => {
    // set canvas & context of canvas
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    // face detection
    const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();
  
    // get current (bounding) video dimention
    var videoWidth = video.getBoundingClientRect().width;
    var videoHeight = video.getBoundingClientRect().height;
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
      console.log(tempEmoji);
    }
  }

  // stream and set interval of detecting video
  const streamDetect = async () => {
    // start webcam
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // get video
    const video = document.getElementById("video");
    video.srcObject = stream;
    
    // get all faceapi models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);

    // while video is playing
    video.addEventListener("play", async () => {
      const detectionInterval = setInterval(async () => {
        // if not streaming: end interval
        if(!isStreamingRef.current){clearInterval(detectionInterval);}
        // detect video
        detect(video);
      }, 100);
    });

  };

  useEffect(() => {
    streamDetect();
  }, []);

  const stopVideo = () => {
    // set current streaming status: false
    setIsStreaming(false);
    // pause video
    const video = document.getElementById("video");
    video.pause();
  };

  const restartVideo = () => {
    // restart detecting
    streamDetect();
    // set current streaming status: true
    setIsStreaming(true);
  };

  const savePhoto = () => {
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
  };

  return (
    <div>
      <canvas id="canvas" className="bg-transparent absolute"/>
      <video id="video" autoPlay/>
      <div>
        {isStreaming
        ? <button onClick={stopVideo}>This emoji!</button>
        : <div>
          <button onClick={restartVideo}>Try Again</button>
          <button onClick={savePhoto}>OK</button>
          </div>
        }
      </div>
    </div>
  );
}

export default Video;