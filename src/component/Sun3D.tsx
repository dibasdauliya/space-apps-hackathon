import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

const Sun = () => {
  const texture = useTexture("/sun_texture.jpg"); // Replace with the path to your sun texture
  const sunRef = useRef();

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001; // Adjust the speed of rotation as needed
      sunRef.current.rotation.x += 0.0005; // Adjust the speed of rotation as needed
    }
  });

  return (
    <mesh ref={sunRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Sun3D = () => {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Sun />
      <OrbitControls />
    </Canvas>
  );
};

export default Sun3D;
