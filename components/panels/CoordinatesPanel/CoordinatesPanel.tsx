"use client";

import React, { useState, useEffect, useRef } from "react";
import { useModelStore } from "@/store/useModelStore";
import VectorInput from "./VectorInput";
import DisplayRow from "./DisplayRow";

export default function CoordinatesPanel() {
  // --- 3D STORE STATE ---
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const updateTransform = useModelStore((s) => s.updateTransform);
  const camera = useModelStore((s) => s.camera);
  const activeObject = useModelStore((s) => s.activeObject);
  const selected = models.find((m) => m.id === selectedId);
  
  // NOTE: You need to add these two to your useModelStore!
  const isInspectorOpen = useModelStore((s) => s.isInspectorOpen);
  const setIsInspectorOpen = useModelStore((s) => s.setIsInspectorOpen);

  // --- DRAG STATE & LOGIC ---
  // Default position: top-20, right-4 (calculated roughly for standard desktop)
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [isMounted, setIsMounted] = useState(false);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Initialize position to the right side of the screen on first mount
  useEffect(() => {
    setPosition({ x: window.innerWidth - 280, y: 80 }); // 280px accounts for width + margin
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

  // If the panel is toggled off, or hasn't mounted client-side yet, don't render it
  if (!isMounted || !isInspectorOpen) return null;

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
          {/* Drag Indicator Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
          <h2 className="text-sm font-bold tracking-wider uppercase text-gray-200">Inspector</h2>
        </div>

        {/* Close Button ('X') - Stop propagation so clicking it doesn't trigger drag */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsInspectorOpen(false)}
          className="text-gray-400 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
          title="Close Inspector"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* 🛠️ PANEL CONTENT */}
      <div className="p-4">
        {/* 🎯 OBJECT */}
        {selected ? (
          <>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Selected Object</p>

            <VectorInput
              label="Position"
              value={
                activeObject
                  ? [
                      activeObject.position.x,
                      activeObject.position.y,
                      activeObject.position.z,
                    ]
                  : selected.position
              }
              onChange={(v) =>
                updateTransform(selected.id, { position: v })
              }
            />

            <VectorInput
              label="Rotation"
              value={
                activeObject
                  ? [
                      activeObject.rotation.x,
                      activeObject.rotation.y,
                      activeObject.rotation.z,
                    ]
                  : selected.rotation
              }
              onChange={(v) =>
                updateTransform(selected.id, { rotation: v })
              }
            />

            <VectorInput
              label="Scale"
              value={
                activeObject
                  ? [
                      activeObject.scale.x,
                      activeObject.scale.y,
                      activeObject.scale.z,
                    ]
                  : selected.scale
              }
              onChange={(v) =>
                updateTransform(selected.id, { scale: v })
              }
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <p className="text-xs text-center">No object selected</p>
          </div>
        )}

        {/* 📷 CAMERA */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Camera</p>
          <DisplayRow label="Position" value={camera.position} />
          <DisplayRow label="Rotation" value={camera.rotation} />
        </div>
      </div>
    </div>
  );
}