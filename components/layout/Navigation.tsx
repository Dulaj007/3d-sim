"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useModelStore } from "@/store/useModelStore";
import { useUiStore } from "@/store/useUiStore";

/**
 * Navigation Component
 *
 * Purpose:
 * - Main top navigation bar of the application
 * - Provides access to:
 *   - Branding & GitHub link
 *   - Documentation link
 *   - Camera lock control
 *   - Environment (HDRI) selection & upload
 *   - Scene export
 *   - Mobile responsive menu
 *
 * Notes:
 * - Uses global store for 3D-related state
 * - Fully responsive (desktop + mobile sidebar)
 */
export default function Navigation() {
  // --- UI STATE ---
  /**
   * Controls visibility of the top navigation (slide up/down).
   * Toggled via the floating round button anchored to the bar.
   */
  const [isOpen, setIsOpen] = useState(true);

  /**
   * Controls visibility of the mobile sidebar menu.
   */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Hamburger Sidebar

  // --- ENV VARIABLES ---
  /**
   * App configuration pulled from environment variables.
   * Provides branding and external links.
   */
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Aether3D";
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "#";

  // --- 3D STORE STATE ---
  /**
   * Global store bindings for scene control.
   */
  const isCameraLocked = useModelStore((s) => s.isCameraLocked);
  const toggleCameraLock = useModelStore((s) => s.toggleCameraLock);
  const exportScene = useModelStore((s) => s.exportScene);
  const environment = useModelStore((s) => s.environment);
  const setEnvironment = useModelStore((s) => s.setEnvironment);
  const setEnvLoading = useModelStore((s) => s.setEnvLoading);
  const restartTour = useUiStore((s) => s.restartTour);

  // --- HANDLERS ---
  /**
   * Handles custom HDRI file uploads.
   *
   * Flow:
   * 1. Read file from input
   * 2. Create temporary object URL
   * 3. Detect file type (HDR or EXR)
   * 4. Update global environment state
   */
  const handleHDRIUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    /**
     * Determine environment type based on file extension.
     */
    const ext = file.name.split(".").pop()?.toLowerCase();
    let type: "hdr" | "exr" = "hdr";
    if (ext === "exr") type = "exr";

    /**
     * Trigger loading state and apply environment.
     */
    setEnvLoading(true);
    setEnvironment(url, type);

    /**
     * Reset input to allow re-uploading same file.
     */
    e.target.value = "";
  };

  /**
   * Predefined HDRI environment presets.
   * Used by Drei's Environment component.
   */
  const presets = [
    "dawn", "sunset", "city", "night", "warehouse",
    "forest", "apartment", "studio", "park", "lobby",
  ];

  return (
    <>
      {/* =========================
          MAIN NAV CONTAINER
          - Floating rounded bar, slides up/down + fades
      ========================= */}
      <div className="fixed top-3 inset-x-0 z-40 flex justify-center px-4">
        <nav
          className={`relative w-full max-w-7xl h-15 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)] px-4 md:px-6 transition-all duration-500 ease-out animate-slide-down-fade ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
          }`}
        >
          <div className="h-full flex items-center justify-between">

            {/* =========================
                LEFT: BRAND & GITHUB
            ========================= */}
            <div className="flex items-center gap-3">
              <span className="font-display text-sm md:text-lg font-semibold tracking-tight text-white">
                {appName}
              </span>

              <div className="hidden lg:flex items-center">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="text-white/70 hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>

            {/* =========================
                RIGHT: DESKTOP TOOLS
            ========================= */}
            <div className="hidden md:flex items-center gap-2">

              {/* Docs link */}
              <Link
                href="/documentation"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Docs
              </Link>

              <div className="w-px h-6 bg-white/10" />

              {/* Help: replay tour */}
              <button
                onClick={restartTour}
                title="Take a tour"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12" y2="17.01"/>
                </svg>
              </button>

              <div className="w-px h-6 bg-white/10" />

              {/* Scene controls: camera lock + HDRI */}
              <div data-tour="nav-tools" className="flex items-center gap-2">
                {/* Camera lock */}
                <button
                  onClick={toggleCameraLock}
                  title="Toggle Camera Lock"
                  className={`flex items-center gap-1 px-2 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    isCameraLocked
                      ? "bg-red-500/60 text-white/90 border-red-500/30 hover:bg-red-500/50"
                      : "bg-emerald-500/60 text-white/90 border-emerald-500/30 hover:bg-emerald-500/50"
                  }`}
                >
                  {isCameraLocked ? (
                    // Locked Icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v2h-4V6a2 2 0 0 1 2-2zm-3 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
                    </svg>
                  ) : (
                    // Unlocked Icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 10V7c0-2.206 1.794-4 4-4s4 1.794 4 4h-2c0-1.103-.897-2-2-2s-2 .897-2 2v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2H8zm-2 2h12v10H6V12zm6 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                    </svg>
                  )}
                  <span>Camera</span>
                </button>

                {/* HDRI group */}
                <div className="flex items-center bg-black/60 border border-white/10 rounded-lg focus-within:border-white/30 transition-colors">
                  {/* Visual Icon for dropdown context */}
                  <div className="pl-2 pr-1 flex items-center text-gray-200 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                  </div>

                  {/* Select Dropdown */}
                  <div className="relative">
                    <select
                      value={environment ?? "none"}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEnvLoading(true);
                        if (value === "none") setEnvironment(null, null);
                        else setEnvironment(value, "preset");
                      }}
                      className="bg-transparent capitalize text-xs text-white outline-none cursor-pointer appearance-none pl-1 pr-7 py-2 rounded-l-lg w-22"
                    >
                      <option value="none" className="bg-gray-900 text-white py-2">No HDRI</option>
                      {presets.map((p) => (
                        <option key={p} value={p} className="bg-gray-900 text-white capitalize py-2">{p}</option>
                      ))}
                      {environment?.startsWith("blob:") && (
                        <option value={environment} className="bg-gray-900 text-white py-2">Custom HDRI</option>
                      )}
                    </select>
                    {/* Custom Dropdown Chevron Indicator */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>

                  {/* Custom HDRI Upload Button (+) */}
                  <label className="cursor-pointer px-4 py-2 m-0.5 rounded-md bg-white/50 hover:bg-white/15 transition-colors flex items-center justify-center hover:text-white text-gray-700" title="Upload Custom HDRI (hdr,exr)">
                    <input type="file" accept=".hdr,.exr" className="hidden" onChange={handleHDRIUpload} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </label>
                </div>
              </div>

              <div className="w-px h-6 bg-white/10" />

              {/* Export */}
              <button
                data-tour="export-button"
                onClick={exportScene}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-400/60 to-blue-600/30 hover:from-blue-800/40 hover:to-blue-500/70 transition-colors duration-500 rounded-lg border border-blue-400/30 text-blue-100 text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>

            </div>
          </div>
        </nav>
      </div>

      {/* =========================
          FLOATING EXPAND / COLLAPSE TOGGLE
          - Standalone circular button, independent of the nav's
            own slide animation, so it stays reachable at all times.
          - Glides between "tucked under the bar" and "top of screen"
            instead of the old clipped V-shaped tab.
      ========================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        title="Toggle navigation"
        className="fixed left-1/2 -translate-x-1/2 z-40 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg hover:bg-white/15 hover:scale-110 active:scale-95 transition-all duration-500 ease-out"
        style={{ top: isOpen ? "60px" : "12px" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-300 transition-transform duration-500 ${!isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* =========================
          MOBILE SIDEBAR MENU
      ========================= */}
      {/* Background Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-black/70 border-l border-white/10 z-50 p-6 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-8">
          <span className="font-display text-white font-semibold tracking-tight">{appName}</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Mobile Docs Link */}
          <Link
            href="/documentation"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-md border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            <span>Docs</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </Link>

          {/* Mobile Camera Lock */}
          <button onClick={toggleCameraLock} className={`flex items-center justify-between px-4 py-3 rounded-md border ${isCameraLocked ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}`}>
            <span>Camera</span>
            {isCameraLocked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v2h-4V6a2 2 0 0 1 2-2zm-3 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 10V7c0-2.206 1.794-4 4-4s4 1.794 4 4h-2c0-1.103-.897-2-2-2s-2 .897-2 2v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2H8zm-2 2h12v10H6V12zm6 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
            )}
          </button>

          {/* Mobile HDRI */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Environment</label>
            <div className="flex gap-2">
              <select
                value={environment ?? "none"}
                onChange={(e) => {
                  const val = e.target.value;
                  setEnvLoading(true);
                  if (val === "none") setEnvironment(null, null);
                  else setEnvironment(val, "preset");
                }}
                className="flex-1 bg-black/40 border border-white/10 rounded-md text-sm text-white px-3 py-2 outline-none"
              >
                <option value="none">No HDRI</option>
                {presets.map((p) => <option key={p} value={p}>{p}</option>)}
                {environment?.startsWith("blob:") && <option value={environment}>Custom HDRI</option>}
              </select>
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 rounded-md flex items-center justify-center px-3">
                <input type="file" accept=".hdr,.exr" className="hidden" onChange={handleHDRIUpload} />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </label>
            </div>
          </div>

          {/* Mobile Export */}
          <button onClick={exportScene} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600/40 rounded-md text-white font-semibold">
            Export Scene
          </button>

          {/* Mobile GitHub Link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-md border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            <span>GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
        </div>
      </div>
    </>
  );
}
