"use client";

/**
 * React Three Fiber hook for subscribing to the render loop.
 * This allows execution of logic on every animation frame.
 */
import { useFrame } from "@react-three/fiber";

/**
 * Global state store (e.g., Zustand).
 * Provides access to shared state and actions across the application.
 */
import { useModelStore } from "@/store/useModelStore";

/**
 * useFrameUpdate Hook
 *
 * Purpose:
 * - Synchronizes the global application state with the internal render loop timing.
 * - Updates a "tick" value in the store using the elapsed time from the Three.js clock.
 *
 * Design Considerations:
 * - This hook does not return anything; it is purely side-effect driven.
 * - Intended to be mounted once within the 3D scene component hierarchy.
 * - Acts as a bridge between the rendering engine and global state.
 *
 * Usage:
 * - Typically invoked inside a top-level 3D component (e.g., Scene)
 * - Ensures that all dependent systems (animations, physics, UI sync) can rely on a shared time reference
 */
export default function useFrameUpdate() {
  /**
   * Extracts the setTick action from the global store.
   * This avoids subscribing to unnecessary state and prevents extra re-renders.
   */
  const setTick = useModelStore((s) => s.setTick);

  /**
   * Registers a callback to run on every frame.
   *
   * @param state - Internal R3F state object containing:
   *   - clock: Three.js Clock instance
   *   - scene, camera, etc.
   *
   * Behavior:
   * - Retrieves elapsed time from the clock
   * - Updates the global "tick" value
   */
  useFrame((state) => {
    setTick(state.clock.elapsedTime);
  });
}