"use client";

import { useRef } from "react";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";

import ModelLoader from "./ModelLoader";
import { useModelStore, ModelItem as ModelItemType } from "@/store/useModelStore";

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

  const mode = useModelStore((s) => s.mode);
  const updateTransform = useModelStore((s) => s.updateTransform);

  return (
    <TransformControls
      enabled={isSelected}
      mode={mode}
      onMouseDown={() => {
        if (orbitRef.current) orbitRef.current.enabled = false;
      }}
      onMouseUp={() => {
        if (orbitRef.current) orbitRef.current.enabled = true;

        if (!groupRef.current) return;

        const obj = groupRef.current;

        updateTransform(model.id, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
          scale: [obj.scale.x, obj.scale.y, obj.scale.z],
        });
      }}
    >
      {/* 🔥 IMPORTANT: THIS is what controls attach to */}
      <group
        ref={groupRef}
        position={model.position}
        rotation={model.rotation}
        scale={model.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(model.id);
        }}
      >
        <ModelLoader url={model.url} />
      </group>
    </TransformControls>
  );
}