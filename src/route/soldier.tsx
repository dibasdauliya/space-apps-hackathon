import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const SoldierModel = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = useRef();
  const mixerRef = useRef();

  useEffect(() => {
    if (gltf.animations.length) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.clipAction(gltf.animations[0]).play();
      mixerRef.current = mixer;
    }
  }, [gltf]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
  });

  return <primitive object={gltf.scene} ref={modelRef} />;
};

export default function Soldier() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Canvas>
        {/* Lighting setup */}
        <ambientLight intensity={1.4} />
        <pointLight intensity={0.8} position={[10, 15, 10]} />
        <pointLight intensity={0.5} position={[-10, -10, -10]} />

        {/* Render the GLB model */}
        <SoldierModel url="/Soldier.glb" />

        {/* Controls for panning, rotating, and zooming */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
