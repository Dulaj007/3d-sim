"use client";

type Props = {
  label: string;
  value: [number, number, number];
};

export default function DisplayRow({ label, value }: Props) {
  return (
    <div className="mb-2">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-xs text-white">
        {value.map((v) => v.toFixed(2)).join(" , ")}
      </p>
    </div>
  );
}