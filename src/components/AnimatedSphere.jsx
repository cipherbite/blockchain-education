import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

const AnimatedSphere = () => {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    sphereRef.current.distort = 0.3 + Math.sin(t) * 0.1;
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.1}>
      {" "}
      {/* Zwiększono skalę o 40% */}
      <MeshDistortMaterial
        color="#1a1a1a"
        attach="material"
        distort={0.3}
        speed={5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

export default AnimatedSphere;
