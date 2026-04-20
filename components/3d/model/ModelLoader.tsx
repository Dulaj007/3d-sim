"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import ModelWrapper from "./ModelWrapper";

export default function ModelLoader({
  url,
}: {
  url: string;
}) {
  const { scene } = useGLTF(url);

  // ✅ clone per instance (VERY IMPORTANT)
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return <ModelWrapper scene={clonedScene} />;
}