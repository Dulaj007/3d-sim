"use client";

import { create } from "zustand";
import * as THREE from "three";

/* =========================
📦 TYPES
========================= */

export type SavePoint = {
  id: string;
  name: string;

  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];

  camera: {
    position: [number, number, number];
    rotation: [number, number, number];
  };
};

export type ModelItem = {
  id: string;
  name: string; 

  url: string;

  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];

  savePoints: SavePoint[];
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
  // 🪟 PANEL STATES
  isObjectsOpen: boolean;
  setIsObjectsOpen: (isOpen: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (isOpen: boolean) => void;

  activeObject: THREE.Object3D | null;
  setActiveObject: (obj: THREE.Object3D | null) => void;

  tick: number;
  setTick: (t: number) => void;

  models: ModelItem[];
  selectedId: string | null;

  mode: TransformMode;

  camera: CameraState;

  isCameraLocked: boolean;
  toggleCameraLock: () => void;

  environment: string | null;
  environmentType: EnvironmentType;
  isEnvLoading: boolean;

  setEnvironment: (env: string | null, type?: EnvironmentType) => void;
  setEnvLoading: (v: boolean) => void;

  isUploading: boolean;
  progress: number;

  addModel: (url: string) => void;
  selectModel: (id: string | null) => void;
  removeModel: (id: string) => void; // 🔥 NEW

  addSavePoint: (modelId: string) => void;
  restoreSavePoint: (modelId: string, pointId: string) => void; 

  exportScene: () => void;

  updateTransform: (
    id: string,
    transform: Partial<
      Pick<ModelItem, "position" | "rotation" | "scale">
    >
  ) => void;

  setMode: (mode: TransformMode) => void;
  setCamera: (cam: CameraState) => void;

  startUpload: () => void;
  setProgress: (p: number) => void;
};

/* =========================
🏗 STORE
========================= */

export const useModelStore = create<ModelState>((set, get) => ({
  // 🪟 PANEL STATES (Defaults to true so they show on load)
  isObjectsOpen: true,
  setIsObjectsOpen: (isOpen) => set({ isObjectsOpen: isOpen }),
  isInspectorOpen: true,
  setIsInspectorOpen: (isOpen) => set({ isInspectorOpen: isOpen }),

  activeObject: null,
  setActiveObject: (obj) => set({ activeObject: obj }),

  tick: 0,
  setTick: (t) => set({ tick: t }),

  models: [],
  selectedId: null,

  mode: "rotate",

  camera: {
    position: [0, 0, 5],
    rotation: [0, 0, 0],
  },

  isCameraLocked: true,
  toggleCameraLock: () =>
    set((state) => ({
      isCameraLocked: !state.isCameraLocked,
    })),

  environment: "sunset",
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

  isUploading: false,
  progress: 0,

  /* =========================
  📦 ACTIONS
  ========================= */

  addModel: (url) =>
    set((state) => {
      const id = crypto.randomUUID();
      const index = state.models.length + 1;

      return {
        models: [
          ...state.models,
          {
            id,
            name: `Object ${index}`, 
            url,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            savePoints: [],
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

  // 🔥 NEW REMOVE FUNCTION
  removeModel: (id) =>
    set((state) => {
      // If we delete the currently selected object, deselect it
      const isSelected = state.selectedId === id;
      
      return {
        models: state.models.filter((m) => m.id !== id),
        selectedId: isSelected ? null : state.selectedId,
        activeObject: isSelected ? null : state.activeObject,
      };
    }),

  /* =========================
  💾 SAVE POINT
  ========================= */

  addSavePoint: (modelId) => {
    const state = get();
    const model = state.models.find((m) => m.id === modelId);
    if (!model) return;

    const newPoint: SavePoint = {
      id: crypto.randomUUID(),
      name: `Point ${model.savePoints.length + 1}`,

      position: model.position,
      rotation: model.rotation,
      scale: model.scale,

      camera: state.camera,
    };

    set({
      models: state.models.map((m) =>
        m.id === modelId
          ? { ...m, savePoints: [...m.savePoints, newPoint] }
          : m
      ),
    });
  },

  /* =========================
  🔥 RESTORE SAVE POINT
  ========================= */

  restoreSavePoint: (modelId, pointId) => {
    const state = get();

    const model = state.models.find((m) => m.id === modelId);
    if (!model) return;

    const point = model.savePoints.find((p) => p.id === pointId);
    if (!point) return;

    set({
      models: state.models.map((m) =>
        m.id === modelId
          ? {
              ...m,
              position: point.position,
              rotation: point.rotation,
              scale: point.scale,
            }
          : m
      ),
      camera: point.camera, 
    });
  },

  /* =========================
  📤 EXPORT
  ========================= */

  exportScene: () => {
    const state = get();

    const data = {
      models: state.models,
      camera: state.camera,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "threejs-scene.json"; // Updated default name
    a.click();

    URL.revokeObjectURL(url);
  },

  /* =========================
  🔄 TRANSFORM
  ========================= */

  updateTransform: (id, transform) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, ...transform } : m
      ),
    })),

  setMode: (mode) => set({ mode }),

  setCamera: (cam) => set({ camera: cam }),

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