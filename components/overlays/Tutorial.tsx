"use client";

import React, { useEffect, useRef, useState } from "react";
import { useModelStore } from "@/store/useModelStore";
import { useUiStore } from "@/store/useUiStore";

/**
 * Tutorial (guided tour)
 *
 * Purpose:
 * - Walks first-time users through the main UI controls using
 *   spotlighted "coachmark" popups, step by step.
 * - Triggered automatically the first time a model is added to the scene.
 * - Can be skipped at any point; the choice is remembered (localStorage),
 *   and can be replayed later via the "?" button in the top navigation.
 */
type Step = {
  target: string;
  title: string;
  body: string;
  forceOpen?: () => void;
};

export default function Tutorial() {
  const models = useModelStore((s) => s.models);
  const setIsObjectsOpen = useModelStore((s) => s.setIsObjectsOpen);
  const setIsInspectorOpen = useModelStore((s) => s.setIsInspectorOpen);

  const tourStage = useUiStore((s) => s.tourStage);
  const tourStep = useUiStore((s) => s.tourStep);
  const promptTour = useUiStore((s) => s.promptTour);
  const skipTour = useUiStore((s) => s.skipTour);
  const beginTourSteps = useUiStore((s) => s.beginTourSteps);
  const nextTourStep = useUiStore((s) => s.nextTourStep);
  const prevTourStep = useUiStore((s) => s.prevTourStep);

  /**
   * Tracks whether the model count just transitioned from 0 → 1,
   * which is the moment we offer the tour.
   */
  const prevModelCount = useRef(0);

  useEffect(() => {
    if (prevModelCount.current === 0 && models.length > 0) {
      promptTour();
    }
    prevModelCount.current = models.length;
  }, [models.length, promptTour]);

  const steps: Step[] = [
    {
      target: '[data-tour="nav-tools"]',
      title: "Scene controls",
      body: "Lock the camera or swap the lighting environment from here.",
    },
    {
      target: '[data-tour="export-button"]',
      title: "Export anytime",
      body: "This downloads the whole scene, including every object and saved checkpoint, as a file you can use elsewhere.",
    },
    {
      target: '[data-tour="transform-modes"]',
      title: "Move, rotate, scale",
      body: "Pick a mode, then drag the gizmo on your model to transform it.",
    },
    {
      target: '[data-tour="add-model"]',
      title: "Add more models",
      body: "Drop in as many models as you like. Each one shows up in the Objects list below.",
    },
    {
      target: '[data-tour="objects-panel"]',
      title: "Objects and checkpoints",
      body: "Select an object and save a checkpoint of its position. Checkpoints capture the camera too, so chaining a few together gives you the keyframes for an animation.",
      forceOpen: () => setIsObjectsOpen(true),
    },
    {
      target: '[data-tour="inspector-panel"]',
      title: "Exact values",
      body: "Type in precise position, rotation, and scale numbers instead of dragging.",
      forceOpen: () => setIsInspectorOpen(true),
    },
  ];

  const lastStepIndex = steps.length - 1;
  const activeStep = tourStage === "step" ? steps[tourStep] : null;

  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!activeStep) {
      setRect(null);
      return;
    }

    activeStep.forceOpen?.();

    const measure = () => {
      const el = document.querySelector(activeStep.target);
      setRect(el ? el.getBoundingClientRect() : null);
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStage, tourStep]);

  if (tourStage === "idle") return null;

  /* =========================
     Intro prompt
  ========================= */
  if (tourStage === "intro") {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-6 text-center animate-fade-in-scale">
          <h2 className="font-display text-xl font-semibold text-white mb-2">
            Want a quick tour?
          </h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            It only takes about a minute to walk through the controls, and you can skip it anytime.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={skipTour}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={beginTourSteps}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-[0_0_16px_rgba(59,130,246,0.4)]"
            >
              Take the tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Spotlight step
  ========================= */
  const tooltipStyle: React.CSSProperties = rect
    ? {
        left: Math.min(Math.max(rect.left, 16), window.innerWidth - 304),
        top: Math.min(rect.bottom + 16, window.innerHeight - 180),
      }
    : {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {rect && (
        <div
          className="absolute rounded-xl ring-2 ring-blue-400/80 transition-all duration-300 ease-out"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
          }}
        />
      )}

      <div
        className="absolute w-72 pointer-events-auto bg-black/80 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.5)] p-4 animate-fade-in-scale"
        style={tooltipStyle}
        key={tourStep}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            Step {tourStep + 1} of {steps.length}
          </span>
          <button
            onClick={skipTour}
            className="text-[11px] text-gray-400 hover:text-white transition-colors"
          >
            Skip tour
          </button>
        </div>

        <h3 className="text-sm font-semibold text-white mb-1">{activeStep?.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">{activeStep?.body}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={prevTourStep}
            disabled={tourStep === 0}
            className="text-xs px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            Back
          </button>
          <button
            onClick={() => nextTourStep(lastStepIndex)}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            {tourStep === lastStepIndex ? "Got it!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
