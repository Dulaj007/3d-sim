"use client";

import { useModelStore } from "@/store/useModelStore";
import React from "react";

export default function HUD() {
  const addModel = useModelStore((s) => s.addModel);
  const models = useModelStore((s) => s.models);

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Aether3D";
  const isUploading = useModelStore((s) => s.isUploading);
  const progress = useModelStore((s) => s.progress);
  const startUpload = useModelStore((s) => s.startUpload);
  const setProgress = useModelStore((s) => s.setProgress);

  // ✅ Hide HUD if at least one model exists
  if (models.length > 0) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload();

    // 🔥 Simulated upload
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);

        const url = URL.createObjectURL(file);
        addModel(url); // ✅ add to multi-model system
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none px-4">
      
      {/* Subtle ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

      {/* 🃏 MAIN WELCOME CARD */}
      <div className="relative pointer-events-auto w-full max-w-md md:max-w-2xl bg-black/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 text-center overflow-hidden">
        
        {/* Decorative Top Highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />

        {/* 🧊 LOGO / ICON */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-transparent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>

        {/* 🖋️ TYPOGRAPHY */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
           {appName}
        </h1>
        
  <p className="text-sm text-gray-400 mb-8 leading-relaxed px-2">
          A visual layout utility for Three.js and React Three Fiber workflows. Parse and instantiate multiple meshes to compose your scene graph in real time. Capture spatial coordinates (Position, Rotation, Scale) to define camera states or animation keyframes, and export your entire scene's transform data as a structured JSON payload for direct canvas integration.
        </p>

        {/* 📤 UPLOAD ZONE */}
        {!isUploading && (
          <label className="group relative block cursor-pointer">
            <input type="file" className="hidden" onChange={handleFile} accept=".glb,.gltf,.obj" />
            <div className="flex flex-col items-center justify-center py-8 px-6 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 group-hover:bg-white/10 group-hover:border-blue-400/50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-300 mb-3 transition-colors">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="text-white font-medium mb-1">Click to browse files</span>
              <span className="text-xs text-gray-500">Supports .GLB, .GLTF, .OBJ</span>
            </div>
          </label>
        )}

        {/* ⏳ PROGRESS BAR */}
        {isUploading && (
          <div className="w-full mt-4 bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
              <span>Importing Model...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden inset-shadow-sm">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-800 transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Simulated light glare on the progress bar */}
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 blur-[2px]" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}