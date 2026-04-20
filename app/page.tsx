"use client";

import Scene from "@/components/3d/Scene/Scene";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Navigation from "@/components/layout/Navigation";
import HUD from "@/components/overlays/HUD";
import CoordinatesPanel from "@/components/panels/CoordinatesPanel/CoordinatesPanel";
import ObjectsPanel from "@/components/panels/ObjectsPanel/ObjectsPanel"; // ✅ NEW

import { useModelStore } from "@/store/useModelStore";

export default function HomePage() {
  const models = useModelStore((state) => state.models);

  return (
    <main className="relative w-full h-screen overflow-hidden">

      {/* 🌌 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* 🧭 Top Navigation */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      <BottomNavigation />

      {/* 🧩 LEFT PANEL (🔥 NEW) */}
      <ObjectsPanel />

      {/* 📊 RIGHT PANEL */}
      <CoordinatesPanel />

      {/* 🎯 HUD (only when empty) */}
      {models.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <HUD />
        </div>
      )}

    </main>
  );
}