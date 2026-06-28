"use client";

import { useEffect, useState } from "react";

/**
 * Splash
 *
 * Shows a brief branded intro the first time someone opens the app in a
 * given browser tab. Stored in sessionStorage so a page reload does not
 * bring it back, but a fresh tab or a closed-and-reopened browser will
 * see it again.
 *
 * The fill, text reveal, and fade-out are all driven by CSS animations
 * (see the splash-* keyframes in globals.css), not by chained timers in
 * React state. The 3D canvas behind this overlay runs its own render
 * loop continuously, and sequential setState calls timed with setTimeout
 * were unreliable next to it. A CSS animation runs on the compositor
 * regardless of what React is doing, so this component only ever makes
 * one state change: deciding once, at mount, whether to show at all.
 * Once it fades out, it stays mounted but invisible and non-interactive
 * rather than unmounting, so there is nothing left to time precisely.
 */
const SESSION_KEY = "splash_seen";

export default function Splash() {
  const [show, setShow] = useState(false);

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Aether3D";

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="splash-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <div className="relative w-20 h-20 rounded-2xl border border-white/10 overflow-hidden mb-5">
        <div className="splash-fill absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 m-auto"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>

      <span className="splash-text font-display text-lg font-semibold tracking-tight text-white">
        {appName}
      </span>
    </div>
  );
}
