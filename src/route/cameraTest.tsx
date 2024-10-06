import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import axios from "axios";

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const handposeModel = await handpose.load();
      setModel(handposeModel);
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (!isCameraOpen) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    const processVideo = async () => {
      if (!videoRef.current || !canvasRef.current || !model) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const predictions = await model.estimateHands(video);

        if (predictions.length > 0) {
          const landmarks = predictions[0].landmarks;

          // Draw landmarks and finger names
          const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
          const fingerTipIndices = [4, 8, 12, 16, 20];

          for (let i = 0; i < fingerTipIndices.length; i++) {
            const [x, y] = landmarks[fingerTipIndices[i]];
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(fingerNames[i], x + 10, y);
          }

          // Calculate distances and openness percentage
          const wrist = landmarks[0];
          const distances = fingerTipIndices.map((i) => {
            const [x, y] = landmarks[i];
            return Math.sqrt((x - wrist[0]) ** 2 + (y - wrist[1]) ** 2);
          });

          // Send the distances to the backend server
          await axios.post("http://127.0.0.1:8000/hand_signal", {
            distances,
          });

          console.log({ distances });
        }
      }

      requestAnimationFrame(processVideo);
    };

    const handleVideoLoaded = () => {
      requestAnimationFrame(processVideo);
    };

    startCamera();

    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", handleVideoLoaded);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", handleVideoLoaded);
      }
    };
  }, [model, isCameraOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsCameraOpen(!isCameraOpen)}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isCameraOpen ? "Close Camera" : "Open Camera"}
      </button>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <button
              onClick={() => setIsCameraOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
