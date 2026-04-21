"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

/* =========================
   TYPES
========================= */

/**
 * Vec3
 *
 * Represents a 3D vector:
 * - [x, y, z]
 */
type Vec3 = [number, number, number];

/**
 * ModelData
 *
 * Defines the structure for each model in the scene.
 */
type ModelData = {
  url: string;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
};

/**
 * SceneData
 *
 * Defines the structure of the entire scene:
 * - List of models
 * - Camera state
 */
type SceneData = {
  models: ModelData[];
  camera: {
    position: Vec3;
    rotation: Vec3;
  };
};

/* =========================
   MODEL COMPONENT
========================= */

/**
 * Model Component
 *
 * Purpose:
 * - Loads a GLTF/GLB model
 * - Clones it to avoid shared reference issues
 * - Applies transform properties (position, rotation, scale)
 *
 * Notes:
 * - useGLTF caches models globally
 * - Cloning ensures each instance is independent
 */
function Model({ url, position, rotation, scale }: ModelData) {
  /**
   * Load GLTF scene from given URL.
   */
  const { scene } = useGLTF(url);

  /**
   * Clone the scene to prevent shared instance bugs.
   * Without this, multiple models using the same GLTF
   * would share transforms and cause unexpected behavior.
   */
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

/* =========================
   JSON DATA
========================= */

/**
 * sceneData
 *
 * Represents exported scene data (likely from your editor).
 * Contains:
 * - Model list with transforms
 * - Camera transform
 *
 * This acts as a runtime scene loader.
 */
const sceneData: SceneData = {
  models: [
    {
      url: "/models/test/sticktreenew.glb",
      position: [-1.008613143896628, 0, 0.7790740635480033],
      rotation: [0.6916458279025484, -0.15369403759859354, -0.5763351451654526],
      scale: [3, 3, 3],
    },
    {
      url: "/models/test/butterfly.glb",
      position: [-1.2872374276336, 0.635752542990591, 1.1181120527242372],
      rotation: [-0.8082619378762519, 1.0327846967332353, 0.8237793360891876],
      scale: [0.6980561638768153, 0.6980561638768153, 0.6980561638768153],
    },
    {
      url: "/models/test/butterfly.glb",
      position: [0.3367925431592127, 0.2330242815312692, 0.4604915772884318],
      rotation: [-0.258752536625285, -0.765375950856508, -0.7728773565246371],
      scale: [0.4029396718451927, 0.4029396718451927, 0.4029396718451927],
    },
  ],
  camera: {
    position: [-0.8599009051542992, 0.4881013138882026, 4.98564511942498],
    rotation: [-0.12092470576419034, -0.08268822632736146, -0.01003629076184702],
  },
};

/* =========================
   MAIN PAGE
========================= */

/**
 * TestScene Component
 *
 * Purpose:
 * - Renders a complete 3D scene using exported JSON data
 * - Demonstrates how saved scene data can be reconstructed
 *
 * Features:
 * - Applies camera transform
 * - Loads multiple models dynamically
 * - Uses environment lighting (HDR preset)
 */
export default function TestScene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        /**
         * Initialize camera using stored scene data.
         */
        camera={{
          position: sceneData.camera.position,
          rotation: sceneData.camera.rotation,
          fov: 50,
        }}
      >
        {/* Directional light for basic illumination */}
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Environment lighting + background */}
        <Environment preset="forest" background />

        {/* Debug helpers (disabled) */}
        {/* <axesHelper args={[2]} /> */}
        {/* <gridHelper args={[10, 10]} /> */}

        {/* Render all models from scene data */}
        {sceneData.models.map((model, index) => (
          <Model key={index} {...model} />
        ))}

        {/* Camera controls (disabled for fixed camera view) */}
        {/* <OrbitControls />*/}
      </Canvas>
    </div>
  );
}