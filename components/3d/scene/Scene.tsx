"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";

import useFrameUpdate from "../hooks/useFrameUpdate";
import Camera from "./Camera";
import Lights from "./Lights";
import Environment from "./Environment";
import ModelItem from "../model/ModelItem";
import { useModelStore } from "@/store/useModelStore";

/* =========================
   📷 Camera Tracker
========================= */
function CameraTracker() {
  const { camera } = useThree();
  const setCamera = useModelStore((s) => s.setCamera);

  useEffect(() => {
    const update = () => {
      setCamera({
        position: [
          camera.position.x,
          camera.position.y,
          camera.position.z,
        ],
        rotation: [
          camera.rotation.x,
          camera.rotation.y,
          camera.rotation.z,
        ],
      });
    };

    update();

    const interval = setInterval(update, 100); // smooth + cheap
    return () => clearInterval(interval);
  }, [camera, setCamera]);

  useFrameUpdate();

  return null;
}

/* =========================
   🌌 Scene
========================= */
export default function Scene() {
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const selectModel = useModelStore((s) => s.selectModel);
  const setActiveObject = useModelStore((s) => s.setActiveObject);

  const isCameraLocked = useModelStore((s) => s.isCameraLocked);

  const orbitRef = useRef<any>(null);

  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true }}
      dpr={[1, 2]}
      onPointerMissed={() => {
        selectModel(null);
        setActiveObject(null);
      }}
    >
      {/* 🎥 Camera */}
      <Camera />

      {/* 📷 Camera tracking */}
      <CameraTracker />

      {/* 💡 Lights */}
      <Lights />

      {/* 🌌 Environment */}
      <Environment />

      {/* 📦 Models */}
      <Suspense fallback={null}>
        {models.map((model) => (
          <ModelItem
            key={model.id}
            model={model}
            isSelected={model.id === selectedId}
            orbitRef={orbitRef}
            onSelect={selectModel}
          />
        ))}
      </Suspense>

      {/* 🎮 Orbit Controls */}
      {models.length > 0 && (
        <OrbitControls
          ref={orbitRef}
          enableDamping
          dampingFactor={0.05}
          enabled={!isCameraLocked}
          enablePan={!isCameraLocked}
          enableZoom={!isCameraLocked}
          rotateSpeed={0.8}
          zoomSpeed={0.6}
        />
      )}
    </Canvas>
  );
}