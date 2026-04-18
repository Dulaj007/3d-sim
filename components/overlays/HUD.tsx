"use client";

import { useModelStore } from "@/store/useModelStore";

export default function HUD() {
  const addModel = useModelStore((s) => s.addModel);
  const models = useModelStore((s) => s.models);

  const isUploading = useModelStore((s) => s.isUploading);
  const progress = useModelStore((s) => s.progress);
  const startUpload = useModelStore((s) => s.startUpload);
  const setProgress = useModelStore((s) => s.setProgress);

  // ✅ Hide HUD if at least one model exists
  if (models.length > 0) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload(file);

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
    <div className="text-center text-white px-6">
      
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
        Aether3D
      </h1>

      {/* Description */}
      <p className="text-white/70 max-w-xl mx-auto mb-6">
        Interactive 3D scene simulator. Upload models and explore them in real time.
      </p>

      {/* Upload Button */}
      {!isUploading && (
        <label className="inline-block cursor-pointer">
          <input type="file" className="hidden" onChange={handleFile} />
          <div className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur-md border border-white/20">
            Upload Model
          </div>
        </label>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-64 mx-auto mt-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-white/60">
            Uploading... {progress}%
          </p>
        </div>
      )}

    </div>
  );
}