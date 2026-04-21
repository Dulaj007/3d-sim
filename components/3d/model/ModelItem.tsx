"use client";

/**
 * React hooks for managing component lifecycle and references.
 */
import { useRef, useEffect } from "react";

/**
 * Drei helper for object transformation (translate, rotate, scale).
 * Provides interactive gizmos inside the 3D scene.
 */
import { TransformControls } from "@react-three/drei";

/**
 * Core Three.js library for 3D object types and manipulation.
 */
import * as THREE from "three";

/**
 * Custom model loader component responsible for loading GLB/GLTF assets.
 */
import ModelLoader from "./ModelLoader";

/**
 * Global store and type definitions.
 * - useModelStore: Zustand (or similar) store for scene state
 * - ModelItemType: Type definition for model data
 */
import {
  useModelStore,
  ModelItem as ModelItemType,
} from "@/store/useModelStore";

/**
 * Props definition for ModelItem component.
 *
 * @property model        - Data representing the model (position, rotation, scale, URL, etc.)
 * @property isSelected   - Whether this model is currently selected
 * @property orbitRef     - Reference to OrbitControls (used to enable/disable camera movement)
 * @property onSelect     - Callback to handle selection changes
 */
type Props = {
  model: ModelItemType;
  isSelected: boolean;
  orbitRef: React.MutableRefObject<any>;
  onSelect: (id: string | null) => void;
};

/**
 * ModelItem Component
 *
 * Purpose:
 * - Represents a single 3D object in the scene
 * - Handles selection, transformation, and synchronization with global state
 *
 * Responsibilities:
 * - Attach TransformControls to the object when selected
 * - Sync store data → Three.js object transforms
 * - Persist object transforms back to store after interaction
 * - Manage interaction with OrbitControls (camera locking)
 */
export default function ModelItem({
  model,
  isSelected,
  orbitRef,
  onSelect,
}: Props) {
  /**
   * Reference to the Three.js group that wraps the model.
   * Used for direct transform manipulation.
   */
  const groupRef = useRef<THREE.Group>(null);

  /**
   * Reference to TransformControls instance.
   * Allows programmatic attachment to objects.
   */
  const controlsRef = useRef<any>(null);

  /**
   * Extract relevant state and actions from the global store.
   * Only selecting required fields prevents unnecessary re-renders.
   */
  const setActiveObject = useModelStore((s) => s.setActiveObject);
  const mode = useModelStore((s) => s.mode); // translate | rotate | scale
  const updateTransform = useModelStore((s) => s.updateTransform);
  const isCameraLocked = useModelStore((s) => s.isCameraLocked);

  /* =========================
     Attach TransformControls
     =========================
     Ensures that the transform gizmo is attached to the correct object
     whenever selection changes.
  */
  useEffect(() => {
    if (controlsRef.current && groupRef.current) {
      controlsRef.current.attach(groupRef.current);
    }
  }, [isSelected]);

  /* =========================
     Sync STORE → OBJECT
     =========================
     Ensures that any updates from the global store (e.g., loading a saved scene)
     are reflected in the actual Three.js object.

     This is critical for:
     - Restoring saved positions
     - External updates to transforms
     - Preventing visual desync between state and scene
  */
  useEffect(() => {
    if (!groupRef.current) return;

    const obj = groupRef.current;

    obj.position.set(...model.position);
    obj.rotation.set(...model.rotation);
    obj.scale.set(...model.scale);
  }, [model.position, model.rotation, model.scale]);

  return (
    <>
      {/* 
        Transform Controls (Gizmo)
        - Enabled only when the object is selected
        - Mode is controlled globally (translate / rotate / scale)
      */}
      <TransformControls
        ref={controlsRef}
        enabled={isSelected}
        mode={mode}
        onMouseDown={() => {
          /**
           * Disable orbit controls while transforming
           * Prevents camera movement conflict with object manipulation
           */
          if (orbitRef.current) orbitRef.current.enabled = false;
        }}
        onMouseUp={() => {
          /**
           * Re-enable orbit controls only if camera is not locked.
           * This allows for a "camera lock" feature in the application.
           */
          if (orbitRef.current && !isCameraLocked) {
            orbitRef.current.enabled = true;
          }

          if (!groupRef.current) return;

          const obj = groupRef.current;

          /**
           * Persist final transform values to the global store.
           *
           * Important:
           * - This ensures precision after user interaction
           * - Avoids drift or mismatch between UI and actual object state
           */
          updateTransform(model.id, {
            position: [obj.position.x, obj.position.y, obj.position.z],
            rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
            scale: [obj.scale.x, obj.scale.y, obj.scale.z],
          });
        }}
      />

      {/* 
        3D Model Wrapper
        - Acts as the transform root
        - Handles selection interaction
      */}
      <group
        ref={groupRef}
        onClick={(e) => {
          /**
           * Prevent click from propagating to the scene background.
           * Ensures only this object is selected.
           */
          e.stopPropagation();

          /**
           * Notify parent about selection change.
           */
          onSelect(model.id);

          /**
           * Store reference to active object globally.
           * Useful for other systems (panels, inspectors, etc.)
           */
          if (groupRef.current) {
            setActiveObject(groupRef.current);
          }
        }}
      >
        {/* 
          Model Loader
          - Responsible for loading and rendering the 3D asset
        */}
        <ModelLoader url={model.url} />
      </group>
    </>
  );
}