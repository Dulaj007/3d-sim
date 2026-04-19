"use client";

import { useRef } from "react";
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
  const modelRef = useRef<THREE.Object3D>(null);

  const setActiveObject = useModelStore((s) => s.setActiveObject);
  const mode = useModelStore((s) => s.mode);
  const updateTransform = useModelStore((s) => s.updateTransform);

  return (
    <>
      {/* 🔥 TransformControls */}
      <TransformControls
        object={modelRef.current ?? undefined}
        enabled={isSelected}
        mode={mode}
  onMouseDown={() => {
  if (orbitRef.current) orbitRef.current.enabled = false;
}}
onMouseUp={() => {
  const isLocked = useModelStore.getState().isCameraLocked;

  if (orbitRef.current && !isLocked) {
    orbitRef.current.enabled = true;
  }
}}
        onObjectChange={() => {
          if (!modelRef.current) return;

          const obj = modelRef.current;

          // ✅ REAL-TIME correct transform sync
          updateTransform(model.id, {
            position: [
              obj.position.x,
              obj.position.y,
              obj.position.z,
            ],
            rotation: [
              obj.rotation.x,
              obj.rotation.y,
              obj.rotation.z,
            ],
            scale: [
              obj.scale.x,
              obj.scale.y,
              obj.scale.z,
            ],
          });
        }}
      />

      {/* 🔥 REAL MODEL */}
      <group
        position={model.position}
        rotation={model.rotation}
        scale={model.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(model.id);

          if (modelRef.current) {
            setActiveObject(modelRef.current);
          }
        }}
      >
        <ModelLoader url={model.url} modelRef={modelRef} />
      </group>
    </>
  );
}