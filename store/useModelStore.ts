"use client";

import { create } from "zustand";
import * as THREE from "three";

/* =========================
📦 TYPES
========================= */

export type ModelItem = {
  id: string;
  url: string;

  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

type TransformMode = "translate" | "rotate" | "scale";

type CameraState = {
  position: [number, number, number];
  rotation: [number, number, number];
};

type EnvironmentType = "preset" | "hdr" | "exr" | null;

/* =========================
🧠 STORE TYPE
========================= */

type ModelState = {
  /* 🎯 Active object */
  activeObject: THREE.Object3D | null;
  setActiveObject: (obj: THREE.Object3D | null) => void;

  /* 🔄 Frame tick */
  tick: number;
  setTick: (t: number) => void;

  /* 📦 Models */
  models: ModelItem[];
  selectedId: string | null;

  /* 🎛 Transform mode */
  mode: TransformMode;

  /* 📷 Camera */
  camera: CameraState;

  /* 🔒 Camera Lock */
  isCameraLocked: boolean;
  toggleCameraLock: () => void;

  /* 🌍 Environment */
  environment: string | null;
  environmentType: EnvironmentType;
  isEnvLoading: boolean;

  setEnvironment: (env: string | null, type?: EnvironmentType) => void;
  setEnvLoading: (v: boolean) => void;

  /* ⬆️ Upload */
  isUploading: boolean;
  progress: number;

  /* 📦 Actions */
  addModel: (url: string) => void;
  selectModel: (id: string | null) => void;

  /* 🔄 Transform */
  updateTransform: (
    id: string,
    transform: Partial<
      Pick<ModelItem, "position" | "rotation" | "scale">
    >
  ) => void;

  /* 🎛 Mode */
  setMode: (mode: TransformMode) => void;

  /* 📷 Camera */
  setCamera: (cam: CameraState) => void;

  /* ⬆️ Upload */
  startUpload: () => void;
  setProgress: (p: number) => void;
};

/* =========================
🏗 STORE
========================= */

export const useModelStore = create<ModelState>((set) => ({
  /* 🎯 ACTIVE OBJECT */
  activeObject: null,
  setActiveObject: (obj) => set({ activeObject: obj }),

  /* 🔄 FRAME TICK */
  tick: 0,
  setTick: (t) => set({ tick: t }),

  /* 📦 MODELS */
  models: [],
  selectedId: null,

  /* 🎛 MODE */
  mode: "rotate",

  /* 📷 CAMERA */
  camera: {
    position: [0, 0, 5],
    rotation: [0, 0, 0],
  },

  /* 🔒 CAMERA LOCK */
  isCameraLocked: true,
  toggleCameraLock: () =>
    set((state) => ({
      isCameraLocked: !state.isCameraLocked,
    })),

  /* 🌍 ENVIRONMENT */
  environment: "city",
  environmentType: "preset",
  isEnvLoading: false,

  setEnvironment: (env, type = "preset") =>
    set({
      environment: env,
      environmentType: env ? type : null,
    }),

  setEnvLoading: (v) =>
    set({
      isEnvLoading: v,
    }),

  /* ⬆️ UPLOAD */
  isUploading: false,
  progress: 0,

  /* =========================
  📦 ACTIONS
  ========================= */

  addModel: (url) =>
    set((state) => {
      const id = crypto.randomUUID();

      return {
        models: [
          ...state.models,
          {
            id,
            url,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        ],
        selectedId: id,
        isUploading: false,
        progress: 100,
      };
    }),

  selectModel: (id) =>
    set({
      selectedId: id,
    }),

  /* =========================
  🔥 TRANSFORM UPDATE
  ========================= */

  updateTransform: (id, transform) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, ...transform } : m
      ),
    })),

  /* =========================
  🎛 MODE
  ========================= */

  setMode: (mode) =>
    set({
      mode,
    }),

  /* =========================
  📷 CAMERA
  ========================= */

  setCamera: (cam) =>
    set({
      camera: cam,
    }),

  /* =========================
  ⬆️ UPLOAD
  ========================= */

  startUpload: () =>
    set({
      isUploading: true,
      progress: 0,
    }),

  setProgress: (p) =>
    set({
      progress: p,
    }),
}));