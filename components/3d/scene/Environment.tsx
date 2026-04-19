"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment as DreiEnvironment } from "@react-three/drei";
import * as THREE from "three";

import { RGBELoader } from "three-stdlib";
import { EXRLoader } from "three-stdlib";

import { useModelStore } from "@/store/useModelStore";

export default function Environment() {
  const { scene } = useThree();

  const environment = useModelStore((s) => s.environment);
  const environmentType = useModelStore((s) => s.environmentType);
  const setEnvLoading = useModelStore((s) => s.setEnvLoading);

  /* =========================
     🔥 ALWAYS RUN HOOK (FIX)
  ========================= */
  useEffect(() => {
    if (!environment) {
      scene.environment = null;
      scene.background = null;
      return;
    }

    // ❌ Skip presets (handled by Drei)
    if (environmentType === "preset") return;

    let loader: any;

    if (environmentType === "hdr") {
      loader = new RGBELoader();
    } else if (environmentType === "exr") {
      loader = new EXRLoader();
    } else {
      return;
    }

    loader.load(environment, (texture: any) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.environment = texture;
      scene.background = texture;

      setEnvLoading(false);
    });

    return () => {
      scene.environment = null;
      scene.background = null;
    };
  }, [environment, environmentType, scene, setEnvLoading]);

  /* =========================
     🌍 PRESET (SAFE RETURN)
  ========================= */
  if (environmentType === "preset" && environment) {
    return <DreiEnvironment preset={environment as any} background />;
  }

  return null;
}