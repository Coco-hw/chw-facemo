import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

// Enabling Camera
const enableCamera = async (videoRef) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error) {
    console.log("Error accessing the camera: " + error);
  }
};

// Disabling Camera ==> not working
const disableCamera = async (videoRef) => {
  try {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks[0].stop();
  } catch (error) {
    console.log("Error accessing the camera: " + error);
  }
};

const Bundle = ({ currentContentId, closeBundle, uploadReply }) => {
  const videoRef = useRef(null);
  const [capturedDataURL, setCapturedDataURL] = useState(null);
  const [isStreaming, setIsStreaming] = useState(true);

  // detect emoji에 쓸 useRef 선언
  const imgRef = useRef();
  const canvasRef = useRef();
  // detecting이 fail했을 경우
  const [detectionFail, setDetectionFail] = useState(false);

  // emoji를 저장할 useRef 선언
  const [currentEmoji, setCurrentEmoji] = useState("");

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

  // image에서 얼굴을 인식하여 영역을 표시하는 함수. face-api 사용.
  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // 캡쳐와 동시에 이모지가 뜨기 위해, detections array에 객체가 생긴 것을 확인 후 진행
    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const box = detections[0].detection.box;

      console.log(expressions);
      // currentEmoji를 최대가중치 감정 emoji로 세팅
      setCurrentEmoji(mapEmoji[biggestOf(expressions)]);

      // canvas 초기화 및 준비 과정
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.matchDimensions(canvas, imgRef.current);
      const resizedDetections = faceapi.resizeResults(detections, canvas);

      // resizedDections는 detections와 유사한 array. 그러나 이미지에 맞게 캔버스 크기 조정했으므로 박스 위치값을 가져올 때는 resizedDections를 사용해야 한다.
      const boxX = resizedDetections[0].detection.box.x;
      const boxY = resizedDetections[0].detection.box.y;
      const boxW = resizedDetections[0].detection.box.width;
      const boxH = resizedDetections[0].detection.box.height;

      // canvas에 detections 바탕으로 그림 그리는 함수. drawDetections는 face-api 제공인데, 이것 대신 우리가 직접 그리면 된다.
      context.strokeStyle = "white";
      context.lineWidth = 5.0;
      context.rect(boxX, boxY, boxW, boxH);
      context.stroke();

      context.font = "50px Arial";
      context.fillText(currentEmoji, boxX + boxW / 2 - 25, boxY - 20);

      // faceapi.draw.drawDetections(canvas, resizedDetections);
      // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }
  };

  // face-api 사용을 위한 모델들을 렌더링 시 불러오는 함수
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
    };

    loadModels();
  }, []);

  useEffect(() => {
    enableCamera(videoRef); // Enable camera on component mount
  }, []);

  // 현재 카메라 화면 캡쳐 및 캔버스에 그리기
  const capturePhoto = () => {
    const video = videoRef.current;

    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataURL = reader.result;
            setCapturedDataURL(dataURL);
            setIsStreaming(false); // Stop streaming after capturing image
          };
          reader.readAsDataURL(blob);
        } else {
          console.log("Failed to capture image. Please try again.");
        }
      }, "image/jpeg");
    }
  };

  const retakePhoto = () => {
    setIsStreaming(true); // Resume camera streaming
    setCapturedDataURL(null); // Reset captured image data

    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop()); // Stop the existing tracks
      video.srcObject = null; // Clear the video source object
    }

    enableCamera(videoRef); // Re-enable the camera stream
  };

  const handleImgLoad = () => {
    handleImage();
  };

  // 바로 찍지 않을 경우
  const notNow = () => {
    disableCamera();
    closeBundle();
  };

  // 찍은 사진 이모지 저장 및 번들 닫기(이모지리스트로 넘어가기)
  const savePhoto = () => {
    // { contentId, replyId, replyEmoji, replyTxt, timestamp }
    uploadReply({
      contentId: currentContentId,
      replyId: Date.now(),
      replyEmoji: currentEmoji,
      timestamp: Date.now(),
    });
    disableCamera();
    closeBundle();
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <div>
        {/* content */}
        <div>
          {isStreaming ? (
            <video id="videoElement" autoPlay ref={videoRef}></video>
          ) : (
            <div>
              <h2>Camera Stream Stopped</h2>
              {capturedDataURL ? (
                <div>
                  <canvas
                    ref={canvasRef}
                    className="bg-transparent absolute"
                    width="940"
                    height="650"
                  />
                  <img
                    src={capturedDataURL}
                    alt="Captured"
                    ref={imgRef}
                    onLoad={handleImgLoad}
                  />
                  <button onClick={retakePhoto}>Retake</button>
                  <button onClick={savePhoto}>OK</button>
                </div>
              ) : (
                <p>No captured image available.</p>
              )}
            </div>
          )}
          {isStreaming && !capturedDataURL && (
            <button onClick={capturePhoto}>Capture and Save</button>
          )}
        </div>
        {/* close Bundle button */}
        <button
          className="bg-blue-500 text-white px-2 rounded mt-4"
          onClick={notNow}
        >
          Not now!
        </button>
      </div>
    </div>
  );
};

export default Bundle;
