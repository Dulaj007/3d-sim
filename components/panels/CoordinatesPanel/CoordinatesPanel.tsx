"use client";

import { useModelStore } from "@/store/useModelStore";
import VectorInput from "./VectorInput";
import DisplayRow from "./DisplayRow";

export default function CoordinatesPanel() {
  const models = useModelStore((s) => s.models);
  const selectedId = useModelStore((s) => s.selectedId);
  const updateTransform = useModelStore((s) => s.updateTransform);
  const camera = useModelStore((s) => s.camera);
const activeObject = useModelStore((s) => s.activeObject);
  const selected = models.find((m) => m.id === selectedId);
const tick = useModelStore((s) => s.tick);
  return (
    <div className="absolute right-4 top-20 w-64 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white">
      
      <h2 className="text-sm font-semibold mb-3">Inspector</h2>

      {/* 🎯 OBJECT */}
      {selected ? (
        <>
          <p className="text-xs text-white/50 mb-2">Selected Object</p>

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
            value={activeObject
  ? [
      activeObject.rotation.x,
      activeObject.rotation.y,
      activeObject.rotation.z,
    ]
  : selected.rotation}
            onChange={(v) =>
              updateTransform(selected.id, { rotation: v })
            }
          />

          <VectorInput
            label="Scale"
            value={activeObject
  ? [
      activeObject.scale.x,
      activeObject.scale.y,
      activeObject.scale.z,
    ]
  : selected.scale}
            onChange={(v) =>
              updateTransform(selected.id, { scale: v })
            }
          />
        </>
      ) : (
        <p className="text-xs text-white/40 mb-4">
          No object selected
        </p>
      )}

      {/* 📷 CAMERA */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-white/50 mb-2">Camera</p>

        <DisplayRow label="Position" value={camera.position} />
        <DisplayRow label="Rotation" value={camera.rotation} />
      </div>
    </div>
  );
}