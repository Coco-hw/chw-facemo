import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import * as faceapi from "face-api.js";

export const DetectEmoji = () => {
  const imgRef = useRef();
  const canvasRef = useRef();
  const [expressions, setExpressions] = useState(null);

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    console.log(detections[0].expressions);

    setExpressions(detections[0].expressions);

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    });

    const resized = faceapi.resizeResults(detections, {
      width: 940,
      height: 650,
    });
    faceapi.draw.drawDetections(canvasRef.current, resized);
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  return (
    <div className="flex">
      <canvas
        ref={canvasRef}
        className="bg-transparent absolute"
        width="940"
        height="650"
      />
      <Image
        src="/assets/sample.jpg"
        ref={imgRef}
        alt="sample"
        width={800}
        height={500}
      />
    </div>
  );
};
