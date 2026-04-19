"use client";

import { useFrame } from "@react-three/fiber";
import { useModelStore } from "@/store/useModelStore";

export default function useFrameUpdate() {
  const setTick = useModelStore((s) => s.setTick);

  useFrame((state) => {
    setTick(state.clock.elapsedTime);
  });
}