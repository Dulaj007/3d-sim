"use client";

import { useState, useEffect } from "react";
import { useModelStore } from "@/store/useModelStore";




type Props = {
  label: string;
  value: [number, number, number];
  onChange?: (v: [number, number, number]) => void;
};

export default function VectorInput({ label, value, onChange }: Props) {
  const [local, setLocal] = useState<string[]>(["0", "0", "0"]);
const tick = useModelStore((s) => s.tick);
  // ✅ Sync from external state
useEffect(() => {
  setLocal(value.map((v) => v.toString()));
}, [value, tick]); // 🔥 ADD tick

  const handleChange = (i: number, val: string) => {
    const updated = [...local];
    updated[i] = val;
    setLocal(updated);

    if (!onChange) return;

    const parsed: [number, number, number] = [
      parseFloat(updated[0]) || 0,
      parseFloat(updated[1]) || 0,
      parseFloat(updated[2]) || 0,
    ];

    onChange(parsed);
  };

  return (
    <div className="mb-3">
      <p className="text-xs text-white/60 mb-1">{label}</p>

      <div className="flex gap-2">
        {local.map((v, i) => (
          <input
            key={i}
            type="text" // 🔥 important (NOT number)
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full px-2 py-1 bg-white/10 text-white rounded text-xs outline-none"
          />
        ))}
      </div>
    </div>
  );
}