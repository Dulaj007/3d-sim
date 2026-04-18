"use client";

import Scene from "@/components/3d/Scene/Scene";
import Navigation from "@/components/layout/Navigation";
import HUD from "@/components/overlays/HUD";
import { useModelStore } from "@/store/useModelStore";

export default function HomePage() {
  const models = useModelStore((state) => state.models);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      
      {/* 🌌 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* 🧭 Top Navigation */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>

      {/* 🎯 HUD ONLY when no models */}
      {models.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <HUD />
        </div>
      )}

    </main>
  );
}