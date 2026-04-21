"use client";

/**
 * Lights Component
 *
 * Purpose:
 * - Defines the base lighting setup for the 3D scene
 * - Provides a simple and balanced illumination model
 *
 * Responsibilities:
 * - Add ambient light for overall scene visibility
 * - Add directional light to simulate a primary light source (e.g., sun)
 *
 * Design Philosophy:
 * - Keep lighting minimal and performant by default
 * - Allow environment maps (HDR/EXR) to enhance realism when enabled
 */
export default function Lights() {
  return (
    <>
      {/* 
        Ambient Light
        - Provides uniform lighting across all objects
        - Ensures no part of the scene is completely dark
        - Does not cast shadows
        - Useful as a base fill light
      */}
      <ambientLight intensity={0.5} />

      {/* 
        Directional Light
        - Simulates a distant light source (e.g., sunlight)
        - Light rays are parallel
        - Affects shading and depth perception
        - Can cast shadows if enabled
      */}
      <directionalLight
        position={[5, 5, 5]} // Positioned diagonally above the scene
        intensity={1}        // Strong primary light source
      />
    </>
  );
}