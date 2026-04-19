"use client";

import { useModelStore } from "@/store/useModelStore";

export default function Navigation() {
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const selectModel = useModelStore((s) => s.selectModel);
  const addModel = useModelStore((s) => s.addModel);

  const mode = useModelStore((s) => s.mode);
  const setMode = useModelStore((s) => s.setMode);

  const isCameraLocked = useModelStore((s) => s.isCameraLocked);
  const toggleCameraLock = useModelStore((s) => s.toggleCameraLock);

  // 🌍 ENVIRONMENT
  const environment = useModelStore((s) => s.environment);
  const setEnvironment = useModelStore((s) => s.setEnvironment);
  const setEnvLoading = useModelStore((s) => s.setEnvLoading);

  /* =========================
     📂 MODEL UPLOAD
  ========================= */
  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    addModel(url);

    e.target.value = "";
  };

  /* =========================
     🌍 HDRI UPLOAD (🔥 FIXED)
  ========================= */
  const handleHDRIUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // 🔥 detect file type
    const ext = file.name.split(".").pop()?.toLowerCase();

    let type: "hdr" | "exr" = "hdr";
    if (ext === "exr") type = "exr";

    setEnvLoading(true);
    setEnvironment(url, type); // ✅ IMPORTANT FIX

    e.target.value = "";
  };

  /* =========================
     🌍 PRESETS
  ========================= */
  const presets = [
    "city",
    "sunset",
    "dawn",
    "night",
    "warehouse",
    "forest",
    "apartment",
    "studio",
    "park",
    "lobby",
  ];

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30 border-b border-white/10">
      
      {/* 🔷 LEFT */}
      <div className="text-white text-lg font-semibold tracking-wide">
        Aether3D
      </div>

      {/* 🔶 CENTER */}
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

      {/* 🔶 RIGHT */}
      <div className="flex items-center gap-3">

        {/* 🔒 Camera Lock */}
        <button
          onClick={toggleCameraLock}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            isCameraLocked
              ? "bg-red-500/20 text-red-300 border-red-500/30"
              : "bg-green-500/20 text-green-300 border-green-500/30"
          }`}
        >
          {isCameraLocked ? "🔒 Locked" : "🔓 Free"}
        </button>

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

        {/* 🌍 ENVIRONMENT SELECT */}
        <select
          value={environment ?? "none"}
          onChange={(e) => {
            const value = e.target.value;

            setEnvLoading(true);

            if (value === "none") {
              setEnvironment(null, null);
            } else {
              setEnvironment(value, "preset"); // ✅ IMPORTANT
            }
          }}
          className="px-3 py-1 text-sm bg-white/10 text-white rounded-md border border-white/20"
        >
          <option value="none">No HDRI</option>

          {presets.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}

          {environment?.startsWith("blob:") && (
            <option value={environment}>Custom HDRI</option>
          )}
        </select>

        {/* 🌍 HDRI Upload */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".hdr,.exr"
            className="hidden"
            onChange={handleHDRIUpload}
          />
          <div className="px-3 py-1 bg-white/10 hover:bg-white/20 transition rounded-md border border-white/20 text-white text-sm">
            HDRI +
          </div>
        </label>

        {/* 📂 Add Model */}
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
          <div className="px-3 py-1 bg-white/10 hover:bg-white/20 transition rounded-md border border-white/20 text-white text-sm">
            + Add
          </div>
        </label>

      </div>
    </nav>
  );
}