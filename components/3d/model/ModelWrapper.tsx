"use client";

/**
 * React utilities:
 * - forwardRef: allows parent components to access internal Three.js object
 * - useEffect: lifecycle hook for post-mount calculations
 * - useRef: persistent reference to Three.js group
 */
import { forwardRef, useEffect, useRef } from "react";

/**
 * Core Three.js library for geometry calculations and transformations.
 */
import * as THREE from "three";

/**
 * ModelWrapper Component
 *
 * Purpose:
 * - Wraps a loaded 3D model (scene)
 * - Normalizes its scale so all models fit consistently in the scene
 * - Exposes the underlying object via forwarded ref for external control
 *
 * Key Responsibilities:
 * - Compute bounding box of the model
 * - Normalize scale based on largest dimension
 * - Provide a stable render container
 */
const ModelWrapper = forwardRef(function ModelWrapper(
  { scene }: { scene: THREE.Group },
  ref: any
) {
  /**
   * Internal reference used for size calculation and scaling.
   * This is separate from the forwarded ref to avoid interfering with external control.
   */
  const innerRef = useRef<THREE.Group>(null);

  /**
   * Normalize model scale after it is mounted or when the scene changes.
   *
   * Process:
   * 1. Compute bounding box of the model
   * 2. Extract size (width, height, depth)
   * 3. Determine the largest dimension
   * 4. Scale model so largest dimension fits a target size (here: 2 units)
   *
   * This ensures:
   * - Consistent visual size across different imported models
   * - Predictable interaction and transformation behavior
   */
  useEffect(() => {
    if (!innerRef.current) return;

    /**
     * Create a bounding box from the model
     */
    const box = new THREE.Box3().setFromObject(innerRef.current);

    /**
     * Vector to store dimensions of the bounding box
     */
    const size = new THREE.Vector3();
    box.getSize(size);

    /**
     * Determine the maximum dimension (largest axis)
     */
    const maxDim = Math.max(size.x, size.y, size.z);

    /**
     * Compute uniform scale factor
     * Target size is 2 units (arbitrary normalization choice)
     */
    const scale = 2 / maxDim;

    /**
     * Apply uniform scaling to the model
     */
    innerRef.current.scale.setScalar(scale);
  }, [scene]);

  return (
    <group ref={innerRef}>
      {/* 
        Primitive Object Rendering
        - Renders the raw Three.js object (GLTF scene)
        - Forwarded ref allows parent components (e.g., TransformControls)
          to directly manipulate this object
      */}
      <primitive ref={ref} object={scene} />
    </group>
  );
});

export default ModelWrapper;