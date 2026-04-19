"use client";

import { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";

const ModelWrapper = forwardRef(function ModelWrapper(
  { scene }: { scene: THREE.Group },
  ref: any
) {
  const innerRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!innerRef.current) return;

    const box = new THREE.Box3().setFromObject(innerRef.current);
    const size = new THREE.Vector3();

    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    innerRef.current.scale.setScalar(scale);
  }, [scene]);

  return (
    <group>
      {/* 🔥 THIS is the REAL object */}
      <primitive ref={ref} object={scene} />
    </group>
  );
});

export default ModelWrapper;