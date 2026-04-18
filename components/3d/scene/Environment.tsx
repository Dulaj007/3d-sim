"use client";

import { Environment as DreiEnvironment } from "@react-three/drei";

export default function Environment() {
  return (
    <DreiEnvironment
      preset="sunset"   // 🔥 built-in preset
      background
    />
  );
}