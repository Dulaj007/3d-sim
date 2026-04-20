"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useModelStore } from "@/store/useModelStore";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Camera() {
  const cameraState = useModelStore((s) => s.camera);

  const camRef = useRef<THREE.PerspectiveCamera>(null);

  // 🔥 sync store → actual camera
  useEffect(() => {
    if (!camRef.current) return;

    camRef.current.position.set(...cameraState.position);
    camRef.current.rotation.set(...cameraState.rotation);
  }, [cameraState]);

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      position={[0, 1, 5]}
      fov={50}
    />
  );
}