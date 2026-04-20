"use client";

import { useRef, useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";

import ModelLoader from "./ModelLoader";
import {
  useModelStore,
  ModelItem as ModelItemType,
} from "@/store/useModelStore";

type Props = {
  model: ModelItemType;
  isSelected: boolean;
  orbitRef: React.MutableRefObject<any>;
  onSelect: (id: string | null) => void;
};

export default function ModelItem({
  model,
  isSelected,
  orbitRef,
  onSelect,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  const setActiveObject = useModelStore((s) => s.setActiveObject);
  const mode = useModelStore((s) => s.mode);
  const updateTransform = useModelStore((s) => s.updateTransform);
  const isCameraLocked = useModelStore((s) => s.isCameraLocked);

  /* =========================
     🔧 Attach TransformControls properly
  ========================= */
  useEffect(() => {
    if (controlsRef.current && groupRef.current) {
      controlsRef.current.attach(groupRef.current);
    }
  }, [isSelected]);

  /* =========================
     🔄 Sync STORE → OBJECT (IMPORTANT)
     This fixes save-point restore not updating visually
  ========================= */
  useEffect(() => {
    if (!groupRef.current) return;

    const obj = groupRef.current;

    obj.position.set(...model.position);
    obj.rotation.set(...model.rotation);
    obj.scale.set(...model.scale);
  }, [model.position, model.rotation, model.scale]);

  return (
    <>
      {/* 🎛 Transform Controls */}
      <TransformControls
        ref={controlsRef}
        enabled={isSelected}
        mode={mode}
        onMouseDown={() => {
          if (orbitRef.current) orbitRef.current.enabled = false;
        }}
        onMouseUp={() => {
          // ✅ re-enable orbit ONLY if unlocked
          if (orbitRef.current && !isCameraLocked) {
            orbitRef.current.enabled = true;
          }

          if (!groupRef.current) return;

          const obj = groupRef.current;

          // ✅ FINAL SAVE (important for precision)
          updateTransform(model.id, {
            position: [obj.position.x, obj.position.y, obj.position.z],
            rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
            scale: [obj.scale.x, obj.scale.y, obj.scale.z],
          });
        }}
      />

      {/* 📦 MODEL */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(model.id);

          if (groupRef.current) {
            setActiveObject(groupRef.current);
          }
        }}
      >
        <ModelLoader url={model.url} />
      </group>
    </>
  );
}