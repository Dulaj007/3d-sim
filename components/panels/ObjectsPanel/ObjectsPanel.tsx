"use client";

import React, { useState, useEffect, useRef } from "react";
import { useModelStore } from "@/store/useModelStore";

export default function ObjectsPanel() {
  // --- 3D STORE STATE ---
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const selectModel = useModelStore((s) => s.selectModel);
  const addSavePoint = useModelStore((s) => s.addSavePoint);
  const restoreSavePoint = useModelStore((s) => s.restoreSavePoint);
  
  // 🔥 NEW: Bring in the remove action
  const removeModel = useModelStore((s) => s.removeModel);

  const isObjectsOpen = useModelStore((s) => s.isObjectsOpen);
  const setIsObjectsOpen = useModelStore((s) => s.setIsObjectsOpen);

  // dropdown state (SAFE)
  const [openId, setOpenId] = useState<string | null>(null);

  // --- DRAG STATE & LOGIC ---
  const [position, setPosition] = useState({ x: 16, y: 80 }); 
  const [isMounted, setIsMounted] = useState(false);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    if (isMounted) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMounted]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  if (!isMounted || !isObjectsOpen) return null;

  return (
    <div
      className="fixed z-50 w-64 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 text-white shadow-2xl flex flex-col overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* 🛑 DRAG HANDLE & HEADER */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
          <h2 className="text-sm font-bold tracking-wider uppercase text-gray-200">Objects</h2>
        </div>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsObjectsOpen(false)}
          className="text-gray-400 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
          title="Close Objects Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* 🛠️ PANEL CONTENT */}
      <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {models.length === 0 && (
           <div className="flex flex-col items-center justify-center py-4 text-gray-500">
             <p className="text-xs text-center">No objects in scene</p>
           </div>
        )}

        {models.map((model) => (
          <div key={model.id} className="mb-4 last:mb-0">
            
            {/* 🎯 MODEL ROW (Select + Delete) */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => selectModel(model.id)}
                className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between ${
                  selectedId === model.id
                    ? "bg-white/90 text-black font-semibold shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    : "bg-white/5 text-gray-300 hover:bg-white/15"
                }`}
              >
                <span className="truncate">{model.name}</span>
                {selectedId === model.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>

              {/* 🗑️ DELETE BUTTON */}
              <button
                onClick={() => removeModel(model.id)}
                className="p-2 rounded-md bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30"
                title="Delete Object"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>

            {/* 💾 SAVE SYSTEM */}
            {selectedId === model.id && (
              <div className="pl-2 border-l-2 border-white/10 ml-2">
                {/* ➕ SAVE POINT */}
                <button
                  onClick={() => addSavePoint(model.id)}
                  className="w-full flex items-center justify-center gap-1 text-xs px-2 py-1.5 mb-2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Save Point
                </button>

                {/* 📍 SAVE POINT LIST */}
                <div className="space-y-1.5">
                  {model.savePoints.map((p) => {
                    const isOpen = openId === p.id;

                    return (
                      <div key={p.id} className="text-xs">
                        {/* 🔥 CLICKABLE ROW */}
                        <div
                          onClick={() => restoreSavePoint(model.id, p.id)}
                          className="flex justify-between items-center px-2 py-1.5 bg-white/5 border border-white/5 rounded cursor-pointer hover:bg-white/15 transition-colors"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            <span className="truncate text-gray-200">{p.name}</span>
                          </div>

                          {/* 🔽 TOGGLE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenId(isOpen ? null : p.id);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                        </div>

                        {/* 📂 DROPDOWN DATA */}
                        {isOpen && (
                          <div className="mt-1 p-2 bg-black/40 rounded-md border border-white/10 space-y-1.5 text-[10px] text-gray-300">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Pos:</span>
                              <span className="font-mono">{p.position.map((v) => v.toFixed(2)).join(", ")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Rot:</span>
                              <span className="font-mono">{p.rotation.map((v) => v.toFixed(2)).join(", ")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Scale:</span>
                              <span className="font-mono">{p.scale.map((v) => v.toFixed(2)).join(", ")}</span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
                              <span className="text-gray-500">Cam:</span>
                              <span className="font-mono">{p.camera.position.map((v) => v.toFixed(1)).join(", ")}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}