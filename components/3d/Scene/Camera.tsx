"use client";

/**
 * PerspectiveCamera from Drei.
 * A wrapper around THREE.PerspectiveCamera integrated with React Three Fiber.
 */
import { PerspectiveCamera } from "@react-three/drei";

/**
 * Global state store.
 * Provides access to persisted camera position and rotation.
 */
import { useModelStore } from "@/store/useModelStore";

/**
 * React hooks for lifecycle and references.
 */
import { useEffect, useRef } from "react";

/**
 * Core Three.js library for camera typing and manipulation.
 */
import * as THREE from "three";

/**
 * Camera Component
 *
 * Purpose:
 * - Provides the main perspective camera for the 3D scene
 * - Synchronizes camera transform (position + rotation) with global state
 *
 * Responsibilities:
 * - Initialize a default camera
 * - Override camera transform when store state changes
 * - Act as the single source of truth for camera configuration in the scene
 *
 * Architectural Role:
 * - Enables features like:
 *   - Saving/restoring camera position
 *   - Camera presets
 *   - External camera control (e.g., UI panels, reset buttons)
 */
export default function Camera() {
  /**
   * Extract camera state from global store.
   * Expected structure:
   * {
   *   position: [x, y, z],
   *   rotation: [x, y, z]
   * }
   */
  const cameraState = useModelStore((s) => s.camera);

  /**
   * Reference to the underlying Three.js PerspectiveCamera instance.
   * Required for direct manipulation of position and rotation.
   */
  const camRef = useRef<THREE.PerspectiveCamera>(null);

  /**
   * Sync STORE → CAMERA
   *
   * Ensures that any updates to the global camera state
   * are reflected in the actual Three.js camera.
   *
   * This is essential for:
   * - Restoring saved views
   * - Programmatic camera movement
   * - Keeping UI and scene in sync
   */
  useEffect(() => {
    if (!camRef.current) return;

    camRef.current.position.set(...cameraState.position);
    camRef.current.rotation.set(...cameraState.rotation);
  }, [cameraState]);

  return (
    <PerspectiveCamera
      /**
       * Attach ref to access the underlying Three.js camera instance.
       */
      ref={camRef}

      /**
       * Marks this camera as the default camera used by the renderer.
       */
      makeDefault

      /**
       * Initial fallback position.
       * Will be overridden by store sync if state exists.
       */
      position={[0, 1, 5]}

      /**
       * Field of View (in degrees).
       * Controls how "wide" the camera sees.
       */
      fov={50}
    />
  );
}