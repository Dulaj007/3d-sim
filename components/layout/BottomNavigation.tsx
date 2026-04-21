"use client";

/**
 * React core import.
 */
import React from "react";

/**
 * Global state store (Zustand or similar).
 * Handles scene state, UI panels, and transform modes.
 */
import { useModelStore } from "@/store/useModelStore";

/**
 * BottomNavigation Component
 *
 * Purpose:
 * - Provides quick-access controls for:
 *   - Adding models
 *   - Switching transform modes (translate, rotate, scale)
 *   - Toggling UI panels (objects, inspector)
 *
 * Design Characteristics:
 * - Floating UI positioned at the bottom center
 * - Uses glassmorphism styling for modern UI appearance
 * - Compact, icon-driven controls for efficiency
 */
export default function BottomNavigation() {
  /* =========================
     Store State (Scene Control)
     ========================= */

  const mode = useModelStore((s) => s.mode);
  const setMode = useModelStore((s) => s.setMode);
  const addModel = useModelStore((s) => s.addModel);

  /* =========================
     Store State (UI Panels)
     ========================= */

  const isObjectsOpen = useModelStore((s) => s.isObjectsOpen);
  const setIsObjectsOpen = useModelStore((s) => s.setIsObjectsOpen);

  const isInspectorOpen = useModelStore((s) => s.isInspectorOpen);
  const setIsInspectorOpen = useModelStore((s) => s.setIsInspectorOpen);

  /* =========================
     File Upload Handler
     =========================
     - Accepts 3D model files
     - Generates a temporary object URL
     - Adds model to the scene via store
  */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /**
     * Create a temporary URL for the uploaded file.
     * This allows immediate rendering without server upload.
     */
    const url = URL.createObjectURL(file);

    /**
     * Add model to global store (scene).
     */
    addModel(url);

    /**
     * Reset input value to allow re-uploading the same file if needed.
     */
    e.target.value = "";
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      
      {/* =========================
         Add Model Button
         =========================
         - Hidden file input triggered by styled label
         - Accepts GLB, GLTF, and OBJ formats
      */}
      <label className="cursor-pointer group flex items-center gap-2 px-4 py-2 bg-blue-700/90 hover:bg-blue-600 backdrop-blur-md transition-all rounded-full border border-blue-400/50 text-white shadow-lg shadow-indigo-500/25 hover:scale-105">
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept=".glb,.gltf,.obj"
        />

        {/* Plus Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>

        {/* Cube Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </label>

      {/* =========================
         Transform Mode Controls
         =========================
         - Allows switching between:
           translate | rotate | scale
         - Updates global transform mode used by TransformControls
      */}
      <div className="flex items-center p-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
        {[
          { 
            key: "translate", 
            title: "Move",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M15 19l-3 3-3-3M2 12h20M12 2v20"/>
              </svg>
            )
          },
          { 
            key: "rotate", 
            title: "Rotate",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            )
          },
          { 
            key: "scale", 
            title: "Scale",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 3l-6 6"/>
                <path d="M21 3v6"/>
                <path d="M21 3h-6"/>
                <path d="M14 14l-4-4"/>
                <path d="M3 21l6-6"/>
                <path d="M3 21v-6"/>
                <path d="M3 21h6"/>
              </svg>
            )
          },
        ].map((m) => (
          <button
            key={m.key}

            /**
             * Update transform mode in global store.
             */
            onClick={() => setMode(m.key as any)}

            title={m.title}

            /**
             * Active state styling:
             * - Highlight selected mode
             * - Provide visual feedback
             */
            className={`p-2.5 rounded-full transition-all ${
              mode === m.key
                ? "bg-white text-black shadow-md"
                : "text-gray-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            {m.icon}
          </button>
        ))}
      </div>

      {/* =========================
         Panel Toggles
         =========================
         - Controls visibility of side panels
         - Objects Panel (left)
         - Inspector Panel (right)
      */}
      <div className="flex items-center gap-1.5 p-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-lg">

        {/* Toggle Objects Panel */}
        <button
          onClick={() => setIsObjectsOpen(!isObjectsOpen)}
          title="Toggle Objects Panel"
          className={`p-2.5 rounded-full transition-all ${
            isObjectsOpen
              ? "bg-white text-black shadow-md"
              : "text-gray-300 hover:bg-white/20 hover:text-white"
          }`}
        >
          {/* Layers Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </button>

        {/* Toggle Inspector Panel */}
        <button
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          title="Toggle Inspector Panel"
          className={`p-2.5 rounded-full transition-all ${
            isInspectorOpen
              ? "bg-white text-black shadow-md"
              : "text-gray-300 hover:bg-white/20 hover:text-white"
          }`}
        >
          {/* Inspector / Sliders Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/>
            <line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/>
            <line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/>
            <line x1="9" y1="8" x2="15" y2="8"/>
            <line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
        </button>
      </div>
    </div>
  );
}