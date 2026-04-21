"use client";

/**
 * useGLTF hook from Drei.
 * Handles loading and caching of GLTF/GLB assets.
 * Internally optimized with suspense and asset reuse.
 */
import { useGLTF } from "@react-three/drei";

/**
 * React hook for memoization.
 * Used here to avoid unnecessary re-cloning of the scene.
 */
import { useMemo } from "react";

/**
 * Wrapper component responsible for rendering and possibly enhancing
 * the loaded model (e.g., materials, shadows, interaction hooks).
 */
import ModelWrapper from "./ModelWrapper";

/**
 * ModelLoader Component
 *
 * Purpose:
 * - Loads a GLTF/GLB model from a given URL
 * - Ensures each instance gets a unique cloned scene
 * - Delegates rendering to ModelWrapper
 *
 * Why Cloning is Important:
 * - GLTF scenes are shared by default (cached by useGLTF)
 * - Without cloning, multiple instances would share the same object reference
 * - This leads to issues such as:
 *   - Transform conflicts (moving one moves all)
 *   - Material/state mutation affecting all instances
 *
 * This component ensures safe instancing by deep cloning the scene.
 */
export default function ModelLoader({
  url,
}: {
  url: string;
}) {
  /**
   * Load the GLTF asset.
   * - scene: root object of the model
   * - Cached automatically by Drei for performance
   */
  const { scene } = useGLTF(url);

  /**
   * Create a deep clone of the loaded scene.
   *
   * Notes:
   * - scene.clone(true) performs a deep clone (including children)
   * - useMemo ensures cloning only happens when the source scene changes
   * - Prevents unnecessary object duplication on re-renders
   */
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  /**
   * Pass the cloned scene to ModelWrapper for rendering.
   * Keeps this component focused purely on loading and instancing logic.
   */
  return <ModelWrapper scene={clonedScene} />;
}