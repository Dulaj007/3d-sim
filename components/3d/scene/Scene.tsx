"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { OrbitControls } from "@react-three/drei";

import Camera from "./Camera";
import Lights from "./Lights";
import Environment from "./Environment";
import ModelItem from "../model/ModelItem";
import { useModelStore } from "@/store/useModelStore";

export default function Scene() {
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const selectModel = useModelStore((s) => s.selectModel);

  const orbitRef = useRef<any>(null);

  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true }}
      dpr={[1, 2]} // 🔥 better rendering on high DPI screens
      onPointerMissed={() => selectModel(null)} // ✅ click empty → deselect
    >
      {/* 🎥 Camera */}
      <Camera />

      {/* 💡 Lights */}
      <Lights />

      {/* 🌌 Environment */}
      <Environment />

      {/* 📦 Models */}
      <Suspense fallback={null}>
        {models.map((model, index) => (
          <ModelItem
            key={model.id}
            model={model}
   
            isSelected={model.id === selectedId}
            orbitRef={orbitRef}
            onSelect={selectModel}
          />
        ))}
      </Suspense>

      {/* 🎮 Camera Controls */}
      {models.length > 0 && (
        <OrbitControls
          ref={orbitRef}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={0.6}
          enablePan={false} // 🔥 IMPORTANT: prevents confusion with object movement
        />
      )}
    </Canvas>
  );
}