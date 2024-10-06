import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
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
          color: 0x00ff00,
          metalness: 0.5,
          roughness: 0.1,
        });
      }
    });
  }, [obj]);

  return <primitive object={obj} ref={modelRef} />;
};

export default function CarView() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Canvas>
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.8} position={[10, 15, 10]} castShadow />
        <pointLight intensity={0.5} position={[-10, -10, -10]} />

        {/* Render the OBJ model */}
        <Model url="/Fusion.obj" />

        {/* Controls for panning, rotating, and zooming */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
