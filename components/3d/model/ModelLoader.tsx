"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import ModelWrapper from "./ModelWrapper";

export default function ModelLoader({
  url,
  modelRef,
}: {
  url: string;
  modelRef: any;
}) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return <ModelWrapper ref={modelRef} scene={clonedScene} />;
}