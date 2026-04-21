"use client";

/**
 * Core React Three Fiber components:
 * - Canvas: root renderer for the 3D scene
 * - useThree: access internal Three.js objects (camera, scene, etc.)
 */
import { Canvas, useThree } from "@react-three/fiber";

/**
 * React utilities:
 * - Suspense: handles async loading (e.g., GLTF models)
 * - useRef: persistent references (OrbitControls)
 * - useEffect: lifecycle side-effects
 */
import { Suspense, useRef, useEffect } from "react";

/**
 * Drei helpers:
 * - OrbitControls: camera interaction (rotate, pan, zoom)
 */
import { OrbitControls } from "@react-three/drei";

/**
 * Custom hooks and components for scene composition.
 */
import useFrameUpdate from "../hooks/useFrameUpdate";
import Camera from "./Camera";
import Lights from "./Lights";
import Environment from "./Environment";
import ModelItem from "../model/ModelItem";

/**
 * Global store for scene state management.
 */
import { useModelStore } from "@/store/useModelStore";

/* =========================
   CameraTracker Component
   =========================
   Purpose:
   - Synchronizes the current camera transform (position + rotation)
     from Three.js → global store
   - Enables persistence, UI reflection, and state-driven camera features
*/
function CameraTracker() {
  /**
   * Access active camera from R3F context.
   */
  const { camera } = useThree();

  /**
   * Store action to update camera state.
   */
  const setCamera = useModelStore((s) => s.setCamera);

  useEffect(() => {
    /**
     * Update function to push camera transform into store.
     */
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

    /**
     * Initial sync on mount .
     */
    update();

    /**
     * Interval-based syncing:
     * - Runs every 100ms
     * - Balances responsiveness and performance
     * - Avoids heavy per-frame updates
     */
    const interval = setInterval(update, 100);

    return () => clearInterval(interval);
  }, [camera, setCamera]);

  /**
   * Global frame tick updater.
   * Keeps simulation time in sync.
   */
  useFrameUpdate();

  return null;
}

/* =========================
   Scene Component
   =========================
   Purpose:
   - Root 3D scene container
   - Composes camera, lighting, environment, models, and controls
*/
export default function Scene() {
  /**
   * Extract relevant state from global store.
   */
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const selectModel = useModelStore((s) => s.selectModel);
  const setActiveObject = useModelStore((s) => s.setActiveObject);

  const isCameraLocked = useModelStore((s) => s.isCameraLocked);

  /**
   * Reference to OrbitControls.
   * Used to enable/disable camera interaction dynamically.
   */
  const orbitRef = useRef<any>(null);

  return (
    <Canvas
      className="w-full h-full"

      /**
       * Enable anti-aliasing for smoother edges.
       */
      gl={{ antialias: true }}

      /**
       * Device pixel ratio:
       * - [1, 2] ensures good balance between performance and sharpness
       */
      dpr={[1, 2]}

      /**
       * Handles clicks on empty space:
       * - Deselect current model
       * - Clear active object reference
       */
      onPointerMissed={() => {
        selectModel(null);
        setActiveObject(null);
      }}
    >
      {/* 🎥 Camera (default scene camera) */}
      <Camera />

      {/* 📷 Camera state tracking */}
      <CameraTracker />

      {/* 💡 Base lighting */}
      <Lights />

      {/* 🌌 Environment lighting/background */}
      <Environment />

      {/* 📦 Model Instances */}
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

      {/* 🎮 Orbit Controls (camera interaction) */}
      {models.length > 0 && (
        <OrbitControls
          ref={orbitRef}

          /**
           * Smooth camera motion
           */
          enableDamping
          dampingFactor={0.05}

          /**
           * Disable all camera interactions when locked
           */
          enabled={!isCameraLocked}
          enablePan={!isCameraLocked}
          enableZoom={!isCameraLocked}

          /**
           * Interaction sensitivity tuning
           */
          rotateSpeed={0.8}
          zoomSpeed={0.6}
        />
      )}
    </Canvas>
  );
}