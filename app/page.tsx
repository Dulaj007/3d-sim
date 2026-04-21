"use client";

/**
 * Root-level imports for core UI sections and 3D scene rendering.
 * These components together form the full simulation interface.
 */
import Scene from "@/components/3d/Scene/Scene";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Navigation from "@/components/layout/Navigation";
import HUD from "@/components/overlays/HUD";
import CoordinatesPanel from "@/components/panels/CoordinatesPanel/CoordinatesPanel";
import ObjectsPanel from "@/components/panels/ObjectsPanel/ObjectsPanel"; // Newly introduced panel for object management

/**
 * Global state hook (Zustand or similar store).
 * Used to access the current list of models in the scene.
 */
import { useModelStore } from "@/store/useModelStore";

/**
 * HomePage Component
 *
 * This is the main entry point of the application UI.
 * It orchestrates layout composition, layering, and conditional rendering.
 *
 * Architectural Notes:
 * - Uses absolute positioning with z-index layering for UI over a 3D canvas.
 * - Keeps Scene always mounted as the background layer.
 * - UI panels and overlays are rendered above the scene.
 */
export default function HomePage() {
  /**
   * Subscribes to the global model store.
   * This ensures the component reacts to changes in the scene's model list.
   */
  const models = useModelStore((state) => state.models);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 
        3D Scene Layer
        - Positioned as the base layer (z-0)
        - Covers the entire viewport
        - All other UI elements are layered above this
      */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* 
        Top Navigation Bar
        - Positioned at the top of the screen
        - High z-index ensures it stays above scene and panels
      */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>

      {/* 
        Bottom Navigation
        - Likely contains controls/tools for interaction
        - Not wrapped because it may internally handle its positioning
      */}
      <BottomNavigation />

      {/* 
        Left Panel: ObjectsPanel
        - Provides object hierarchy, selection, or management UI
        - Introduced as a key feature for scene interaction
      */}
      <ObjectsPanel />

      {/* 
        Right Panel: CoordinatesPanel
        - Displays positional/transform data of selected objects
        - Useful for precise control in a 3D environment
      */}
      <CoordinatesPanel />

      {/* 
        HUD Overlay (Empty State)
        - Only rendered when no models exist in the scene
        - Acts as a guide or onboarding UI for first interaction
        - Positioned centrally above the scene but below navigation (z-10)
      */}
      {models.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <HUD />
        </div>
      )}
    </main>
  );
}