"use client";

export default function Lights() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
      />
    </>
  );
}