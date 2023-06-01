import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

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

const Bundle = ({closeBundle}) => {
  const videoRef = useRef(null);
  const [capturedDataURL, setCapturedDataURL] = useState(null);
  const [isStreaming, setIsStreaming] = useState(true);

  // detect emoji에 쓸 useRef 선언
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    console.log(detections[0].detection.box);
    console.log(detections[0].expressions);

    // canvas 초기화
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.matchDimensions(canvas, imgRef.current);

    const resizedDetections = faceapi.resizeResults(detections, canvas);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  };

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
          onClick={closeBundle}
        >
          Not now!
        </button>

      </div>
    </div>
  );
}

export default Bundle;