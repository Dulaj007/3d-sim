"use client";

import { create } from "zustand";
import * as THREE from "three";

/* =========================
📦 TYPES
========================= */

/**
 * SavePoint
 *
 * Represents a snapshot of a model’s transform
 * along with the camera state at that moment.
 */
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

/**
 * ModelItem
 *
 * Represents a single 3D model instance in the scene.
 */
export type ModelItem = {
  id: string;
  name: string; 

  url: string;

  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];

  savePoints: SavePoint[];
};

/**
 * Transform modes used by TransformControls.
 */
type TransformMode = "translate" | "rotate" | "scale";

/**
 * Camera state representation stored globally.
 */
type CameraState = {
  position: [number, number, number];
  rotation: [number, number, number];
};

/**
 * Environment types supported by the system.
 */
type EnvironmentType = "preset" | "hdr" | "exr" | null;

/* =========================
🧠 STORE TYPE
========================= */

/**
 * ModelState
 *
 * Defines the full shape of the global store.
 * Includes:
 * - UI state
 * - Scene state
 * - Actions
 */
type ModelState = {
  // 🪟 PANEL STATES
  isObjectsOpen: boolean;
  setIsObjectsOpen: (isOpen: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (isOpen: boolean) => void;

  /**
   * Reference to the currently active Three.js object.
   * Used for real-time transform syncing.
   */
  activeObject: THREE.Object3D | null;
  setActiveObject: (obj: THREE.Object3D | null) => void;

  /**
   * Global time tick (used for frame-based updates).
   */
  tick: number;
  setTick: (t: number) => void;

  /**
   * Scene models and selection.
   */
  models: ModelItem[];
  selectedId: string | null;

  /**
   * Current transform mode.
   */
  mode: TransformMode;

  /**
   * Camera state.
   */
  camera: CameraState;

  /**
   * Camera interaction lock state.
   */
  isCameraLocked: boolean;
  toggleCameraLock: () => void;

  /**
   * Environment (HDRI / preset).
   */
  environment: string | null;
  environmentType: EnvironmentType;
  isEnvLoading: boolean;

  setEnvironment: (env: string | null, type?: EnvironmentType) => void;
  setEnvLoading: (v: boolean) => void;

  /**
   * Upload state (HUD).
   */
  isUploading: boolean;
  progress: number;

  /**
   * Core actions.
   */
  addModel: (url: string) => void;
  selectModel: (id: string | null) => void;
  removeModel: (id: string) => void;

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
🏗 STORE IMPLEMENTATION
========================= */

/**
 * useModelStore
 *
 * Global Zustand store managing:
 * - Scene data
 * - UI state
 * - Interaction logic
 */
export const useModelStore = create<ModelState>((set, get) => ({
  // 🪟 PANEL STATES (Defaults visible)
  isObjectsOpen: true,
  setIsObjectsOpen: (isOpen) => set({ isObjectsOpen: isOpen }),

  isInspectorOpen: true,
  setIsInspectorOpen: (isOpen) => set({ isInspectorOpen: isOpen }),

  /**
   * Active Three.js object reference.
   */
  activeObject: null,
  setActiveObject: (obj) => set({ activeObject: obj }),

  /**
   * Frame tick.
   */
  tick: 0,
  setTick: (t) => set({ tick: t }),

  /**
   * Scene models.
   */
  models: [],
  selectedId: null,

  /**
   * Default transform mode.
   */
  mode: "rotate",

  /**
   * Default camera state.
   */
  camera: {
    position: [0, 0, 5],
    rotation: [0, 0, 0],
  },

  /**
   * Camera lock toggle.
   */
  isCameraLocked: true,
  toggleCameraLock: () =>
    set((state) => ({
      isCameraLocked: !state.isCameraLocked,
    })),

  /**
   * Default environment (preset).
   */
  environment: "sunset",
  environmentType: "preset",
  isEnvLoading: false,

  /**
   * Set environment (preset or custom HDRI).
   */
  setEnvironment: (env, type = "preset") =>
    set({
      environment: env,
      environmentType: env ? type : null,
    }),

  /**
   * Set environment loading state.
   */
  setEnvLoading: (v) =>
    set({
      isEnvLoading: v,
    }),

  /**
   * Upload state.
   */
  isUploading: false,
  progress: 0,

  /* =========================
  📦 MODEL ACTIONS
  ========================= */

  /**
   * Adds a new model to the scene.
   * - Generates unique ID
   * - Assigns default transform
   * - Auto-selects the new model
   */
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

  /**
   * Selects a model.
   */
  selectModel: (id) =>
    set({
      selectedId: id,
    }),

  /**
   * Removes a model from the scene.
   * - Clears selection if needed
   * - Clears active object if needed
   */
  removeModel: (id) =>
    set((state) => {
      const isSelected = state.selectedId === id;
      
      return {
        models: state.models.filter((m) => m.id !== id),
        selectedId: isSelected ? null : state.selectedId,
        activeObject: isSelected ? null : state.activeObject,
      };
    }),

  /* =========================
  💾 SAVE POINT SYSTEM
  ========================= */

  /**
   * Creates a save point for a model.
   * Captures:
   * - Model transform
   * - Current camera state
   */
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

  /**
   * Restores a saved transform + camera state.
   */
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
  📤 EXPORT SYSTEM
  ========================= */

  /**
   * Exports full scene data as JSON file.
   */
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
    a.download = "threejs-scene.json";
    a.click();

    URL.revokeObjectURL(url);
  },

  /* =========================
  🔄 TRANSFORM SYSTEM
  ========================= */

  /**
   * Updates model transform.
   */
  updateTransform: (id, transform) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, ...transform } : m
      ),
    })),

  /**
   * Set transform mode.
   */
  setMode: (mode) => set({ mode }),

  /**
   * Update camera state.
   */
  setCamera: (cam) => set({ camera: cam }),

  /**
   * Start upload process.
   */
  startUpload: () =>
    set({
      isUploading: true,
      progress: 0,
    }),

  /**
   * Update upload progress.
   */
  setProgress: (p) =>
    set({
      progress: p,
    }),
}));