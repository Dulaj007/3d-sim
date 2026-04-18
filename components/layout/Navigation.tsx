"use client";

import { useModelStore } from "@/store/useModelStore";

export default function Navigation() {
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const selectModel = useModelStore((s) => s.selectModel);
  const addModel = useModelStore((s) => s.addModel);

  const mode = useModelStore((s) => s.mode);
  const setMode = useModelStore((s) => s.setMode);

const handleUpload = (e: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  addModel(url);

  e.target.value = ""; // 🔥 FIX: allow same file again
};

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30 border-b border-white/10">
      
      {/* 🔷 LEFT: Logo */}
      <div className="text-white text-lg font-semibold tracking-wide">
        Aether3D
      </div>

      {/* 🔶 CENTER: Object Selector */}
      <div className="flex items-center gap-2">
        {models.map((model, index) => (
          <button
            key={model.id}
            onClick={() => selectModel(model.id)}
            className={`px-3 py-1 rounded-md text-sm transition ${
              selectedId === model.id
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Object {index + 1}
          </button>
        ))}
      </div>

      {/* 🔶 RIGHT: Controls */}
      <div className="flex items-center gap-3">

        {/* 🎛 Transform Modes */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          {[
            { key: "translate", label: "Move" },
            { key: "rotate", label: "Rotate" },
            { key: "scale", label: "Scale" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as any)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                mode === m.key
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* 📂 Add Model */}
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpload} />
          <div className="px-3 py-1 bg-white/10 hover:bg-white/20 transition rounded-md border border-white/20 text-white text-sm">
            + Add
          </div>
        </label>

      </div>
    </nav>
  );
}