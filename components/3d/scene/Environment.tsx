"use client";

/**
 * React hook for lifecycle side effects.
 */
import { useEffect } from "react";

/**
 * React Three Fiber hook to access core Three.js objects.
 */
import { useThree } from "@react-three/fiber";

/**
 * Drei Environment helper for quick preset-based HDR environments.
 */
import { Environment as DreiEnvironment } from "@react-three/drei";

/**
 * Core Three.js library for texture mapping and rendering configuration.
 */
import * as THREE from "three";

/**
 * Loaders for high dynamic range environment maps.
 * - RGBELoader: for .hdr files
 * - EXRLoader: for .exr files
 */
import { RGBELoader } from "three-stdlib";
import { EXRLoader } from "three-stdlib";

/**
 * Global store for environment configuration.
 */
import { useModelStore } from "@/store/useModelStore";

/**
 * Environment Component
 *
 * Purpose:
 * - Manages scene lighting and background using environment maps
 * - Supports both:
 *   1. Preset environments (via Drei)
 *   2. Custom HDR/EXR environment files
 *
 * Responsibilities:
 * - Load and apply environment textures
 * - Handle cleanup on change/unmount
 * - Synchronize loading state with global store
 *
 * Architectural Note:
 * - This component centralizes all environment logic, ensuring consistent lighting behavior
 *   across the scene.
 */
export default function Environment() {
  /**
   * Access the Three.js scene object.
   * Used to apply environment and background textures.
   */
  const { scene } = useThree();

  /**
   * Extract environment-related state from global store.
   */
  const environment = useModelStore((s) => s.environment); // URL or preset name
  const environmentType = useModelStore((s) => s.environmentType); // "preset" | "hdr" | "exr"
  const setEnvLoading = useModelStore((s) => s.setEnvLoading);

  /* =========================
     Environment Loader Effect
     =========================
     Handles custom HDR/EXR environments.
     Runs whenever environment or type changes.
  */
  useEffect(() => {
    /**
     * If no environment is set:
     * - Clear both lighting and background
     */
    if (!environment) {
      scene.environment = null;
      scene.background = null;
      return;
    }

    /**
     * Skip preset handling here.
     * Presets are handled declaratively via Drei component below.
     */
    if (environmentType === "preset") return;

    /**
     * Select appropriate loader based on file type.
     */
    let loader: any;

    if (environmentType === "hdr") {
      loader = new RGBELoader();
    } else if (environmentType === "exr") {
      loader = new EXRLoader();
    } else {
      return;
    }

    /**
     * Begin loading environment texture.
     */
    loader.load(environment, (texture: any) => {
      /**
       * Set mapping for proper environment reflection.
       * Required for physically correct lighting.
       */
      texture.mapping = THREE.EquirectangularReflectionMapping;

      /**
       * Apply environment map:
       * - scene.environment → affects lighting/reflections
       * - scene.background → visible skybox/background
       */
      scene.environment = texture;
      scene.background = texture;

      /**
       * Notify store that environment loading is complete.
       */
      setEnvLoading(false);
    });

    /**
     * Cleanup function:
     * - Clears environment when component unmounts or dependencies change
     * - Prevents stale textures from persisting
     */
    return () => {
      scene.environment = null;
      scene.background = null;
    };
  }, [environment, environmentType, scene, setEnvLoading]);

  /* =========================
     Preset Environment (Drei)
     =========================
     Declarative handling of built-in HDR presets.
     This avoids manual loading and simplifies usage.
  */
  if (environmentType === "preset" && environment) {
    return <DreiEnvironment preset={environment as any} background />;
  }

  /**
   * No environment applied.
   */
  return null;
}