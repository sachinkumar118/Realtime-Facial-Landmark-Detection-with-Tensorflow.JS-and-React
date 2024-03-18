import React, { useRef, useEffect } from "react"; // Importing necessary modules from React
import "./App.css"; // Importing CSS styles
import * as tf from "@tensorflow/tfjs"; // Importing TensorFlow.js library
import * as facemesh from "@tensorflow-models/face-landmarks-detection"; // Importing Face Landmarks Detection model from TensorFlow.js
import Webcam from "react-webcam"; // Importing React Webcam component
import { drawMesh } from "./utilities"; // Importing drawMesh function from utilities file

function App() {
  const webcamRef = useRef(null); // Creating a reference for the webcam
  const canvasRef = useRef(null); // Creating a reference for the canvas

  // Function to load and run the Face Landmarks Detection model
  const runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh); // Loading the Face Landmarks Detection model
    setInterval(() => {
      detect(net); // Calling the detect function repeatedly
    }, 10);
  };
  
  // Function to detect faces and draw facial landmarks on the canvas
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video; // Accessing the video element from the webcam reference
      const videoWidth = webcamRef.current.video.videoWidth; // Getting the video width
      const videoHeight = webcamRef.current.video.videoHeight; // Getting the video height

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces({ input: video }); // Estimating facial landmarks using the Face Landmarks Detection model
      console.log(face); // Logging the detected face data

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d"); // Accessing 2D drawing context of the canvas
      requestAnimationFrame(() => { // Requesting animation frame to ensure smooth rendering
        drawMesh(face, ctx); // Calling drawMesh function to draw facial landmarks on the canvas
      });
    }
  };

  useEffect(() => {
    runFacemesh(); // Running Face Landmarks Detection model on component mount
  }, []);
    
  return (
    <div className="App">
      <header className="App-header">
        {/* Rendering the webcam */}
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9, // Correcting typo: zindex -> zIndex
            width: 640,
            height: 480,
          }}
        />

        {/* Rendering the canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9, // Correcting typo: zindex -> zIndex
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
