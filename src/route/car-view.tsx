import React, { useRef, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

const Model = ({ url }) => {
  const obj = useLoader(OBJLoader, url);
  const modelRef = useRef();

  useEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Apply a material that highlights the geometry
        child.material = new THREE.MeshStandardMaterial({
          color: 0x808080,
          metalness: 0.5,
          roughness: 0.1,
        });
      }
    });
  }, [obj]);

  return <primitive object={obj} ref={modelRef} />;
};

const CameraSetup = () => {
  const { camera } = useThree();

  useEffect(() => {
    // Set the initial camera position
    camera.position.set(0, 10, 40); // Adjust the z-value to control the initial zoom level
  }, [camera]);

  return null;
};

export default function CarView() {
  return (
    <div
      style={{
        width: "500px",
        height: "400px",
        zIndex: 9999,
        // overflow: "hidden",
        // margin: "0 auto",
      }}
    >
      <Canvas>
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.8} position={[10, 15, 10]} castShadow />
        <pointLight intensity={0.5} position={[-10, -10, -10]} />

        {/* Render the OBJ model */}
        <Model url="/hand.obj" />

        {/* Camera setup */}
        <CameraSetup />

        {/* Controls for panning, rotating, and zooming */}
        <OrbitControls
          minDistance={10}
          maxDistance={100}
          target={[0, 0, 0]} // Focus on the center of the scene
        />
      </Canvas>
    </div>
  );
}
