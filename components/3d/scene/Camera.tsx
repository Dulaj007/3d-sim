"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useModelStore } from "@/store/useModelStore";

export default function Camera() {
  const url = useModelStore((state) => state.url);

  return (
    <PerspectiveCamera
      makeDefault
      position={url ? [0, 2, 6] : [0, 1, 5]}
      fov={50}
    />
  );
}