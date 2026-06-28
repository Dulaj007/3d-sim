"use client";

import { create } from "zustand";

/**
 * Onboarding tour for first-time users.
 *
 * Stages:
 * - "idle"  → not showing anything
 * - "intro" → "want a quick tour?" prompt, shown once after the first model lands
 * - "step"  → walking through spotlighted UI steps
 */
type TourStage = "idle" | "intro" | "step";

const STORAGE_KEY = "aether3d_tour_completed";

const hasCompletedTour = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
};

const persistTourCompleted = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "1");
};

type UiState = {
  tourStage: TourStage;
  tourStep: number;

  /** Shows the "want a tour?" prompt, unless the user has already seen it. */
  promptTour: () => void;

  /** Skips/dismisses the tour and remembers that choice. */
  skipTour: () => void;

  /** Starts walking through the spotlighted steps. */
  beginTourSteps: () => void;

  /** Re-opens the tour from the start, regardless of past completion. */
  restartTour: () => void;

  nextTourStep: (lastStepIndex: number) => void;
  prevTourStep: () => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  tourStage: "idle",
  tourStep: 0,

  promptTour: () => {
    if (hasCompletedTour()) return;
    set({ tourStage: "intro" });
  },

  skipTour: () => {
    persistTourCompleted();
    set({ tourStage: "idle", tourStep: 0 });
  },

  beginTourSteps: () => set({ tourStage: "step", tourStep: 0 }),

  restartTour: () => set({ tourStage: "step", tourStep: 0 }),

  nextTourStep: (lastStepIndex) => {
    const next = get().tourStep + 1;
    if (next > lastStepIndex) {
      persistTourCompleted();
      set({ tourStage: "idle", tourStep: 0 });
    } else {
      set({ tourStep: next });
    }
  },

  prevTourStep: () => set((s) => ({ tourStep: Math.max(0, s.tourStep - 1) })),
}));
