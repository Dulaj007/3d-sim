"use client";

import { create } from "zustand";

export type ModelItem = {
  id: string;
  url: string;

  // 📍 Transform state
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

type TransformMode = "translate" | "rotate" | "scale";

type ModelState = {
  // 📦 models
  models: ModelItem[];
  selectedId: string | null;

  // 🎛 transform mode
  mode: TransformMode;

  // ⬆️ upload state
  isUploading: boolean;
  progress: number;

  // 📦 actions
  addModel: (url: string) => void;
  selectModel: (id: string | null) => void;

  // 🔄 transform updates
  updatePosition: (id: string, position: [number, number, number]) => void;
  updateRotation: (id: string, rotation: [number, number, number]) => void;
  updateScale: (id: string, scale: [number, number, number]) => void;

  // 🔥 NEW: unified transform update (IMPORTANT)
  updateTransform: (
    id: string,
    transform: Partial<
      Pick<ModelItem, "position" | "rotation" | "scale">
    >
  ) => void;

  // 🎛 mode actions
  setMode: (mode: TransformMode) => void;

  // ⬆️ upload actions
  startUpload: () => void;
  setProgress: (p: number) => void;
};

export const useModelStore = create<ModelState>((set) => ({
  // 📦 initial state
  models: [],
  selectedId: null,

  // 🎛 default mode
  mode: "rotate",

  // ⬆️ upload
  isUploading: false,
  progress: 0,

  // ✅ add model
  addModel: (url) =>
    set((state) => {
      const id = crypto.randomUUID();

      return {
        models: [
          ...state.models,
          {
            id,
            url,

            // 🔥 default transforms
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

  // ✅ select model
  selectModel: (id) =>
    set({
      selectedId: id,
    }),

  // 🔹 granular updates (still usable)
  updatePosition: (id, position) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, position } : m
      ),
    })),

  updateRotation: (id, rotation) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, rotation } : m
      ),
    })),

  updateScale: (id, scale) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, scale } : m
      ),
    })),

  // 🔥 unified update (USED IN ModelItem)
  updateTransform: (id, transform) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, ...transform } : m
      ),
    })),

  // 🎛 change transform mode
  setMode: (mode) =>
    set({
      mode,
    }),

  // ⬆️ start upload
  startUpload: () =>
    set({
      isUploading: true,
      progress: 0,
    }),

  // ⬆️ update upload progress
  setProgress: (p) =>
    set({
      progress: p,
    }),
}));