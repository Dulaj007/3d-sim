"use client";

import React, { useState } from "react";
import { useModelStore } from "@/store/useModelStore";

export default function Navigation() {
  // --- UI STATE ---
  const [isOpen, setIsOpen] = useState(true); // V-Shape drop down
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Hamburger Sidebar

  // --- ENV VARIABLES ---
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Aether3D";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "#";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

  // --- 3D STORE STATE ---
  const isCameraLocked = useModelStore((s) => s.isCameraLocked);
  const toggleCameraLock = useModelStore((s) => s.toggleCameraLock);
  const exportScene = useModelStore((s) => s.exportScene);
  const environment = useModelStore((s) => s.environment);
  const setEnvironment = useModelStore((s) => s.setEnvironment);
  const setEnvLoading = useModelStore((s) => s.setEnvLoading);

  // --- HANDLERS ---
  const handleHDRIUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const ext = file.name.split(".").pop()?.toLowerCase();
    let type: "hdr" | "exr" = "hdr";
    if (ext === "exr") type = "exr";
    setEnvLoading(true);
    setEnvironment(url, type);
    e.target.value = "";
  };

  const presets = [
     "sunset","city", "dawn", "night", "warehouse", 
    "forest", "apartment", "studio", "park", "lobby",
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="relative h-15 w-full bg-black/40 backdrop-blur-md border-b border-white/10 shadow-2xl px-4 md:px-6">
          {/* Centered max-w container */}
          <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
            
            {/* =========================
                🔷 LEFT: BRAND & SOCIALS
            ========================= */}
            <div className="flex items-center gap-1">
         <span className="text-sm md:text-xl font-bold tracking-wide uppercase italic ">
  {appName}
</span>
              
              {/* Social Icons - Combined Pill with Solid Icons, Hover Colors & Scale */}
              <div className="hidden lg:flex items-center gap-2   px-2 py-1.5 ">
                {/* Facebook Solid */}
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-[#92c1ff] hover:scale-200 transition-transform duration-500 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* LinkedIn Solid */}
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-[#a4d2ff] hover:scale-200 transition-transform duration-500 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* GitHub Solid */}
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-[#a7ffb7] hover:scale-200 transition-transform duration-500 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
                {/* Instagram Solid */}
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-[#ffb5c2] hover:scale-200 transition-transform duration-500 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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
                🔶 RIGHT: DESKTOP TOOLS
            ========================= */}
            <div className="hidden md:flex items-center gap-2">

              {/* 🔒 Camera Lock */}
              <button
                onClick={toggleCameraLock}
                title="Toggle Camera Lock"
                className={`flex items-center gap-1 px-2 py-2 text-xs font-medium rounded border transition-all ${
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

              <div className="w-px h-6 bg-white/10" />

              {/* 🌍 HDRI GROUP: More rounded (pill-shaped) */}
              <div className="flex items-center bg-black/60 border  border-white/10 rounded focus-within:border-white/30 transition-colors">
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
                    className="bg-transparent capitalize text-xs text-white outline-none cursor-pointer appearance-none pl-1 pr-7 py-2 rounded-l-full w-22"
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

                {/* Separator */}
                <div className=" " />

                {/* Custom HDRI Upload Button (+) */}
                <label className="cursor-pointer px-4 py-2 m-0.5 bg-white/50 hover:bg-white/15 transition-colors flex items-center justify-center hover:text-white text-gray-700 " title="Upload Custom HDRI (hdr,exr)">
                  <input type="file" accept=".hdr,.exr" className="hidden" onChange={handleHDRIUpload} />
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="  transition-colors">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </label>
              </div>

              <div className="w-px h-6 bg-white/10" />

              {/* 📤 EXPORT */}
              <button
                onClick={exportScene}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-400/60 to-blue-600/30 hover:from-blue-800/40 hover:to-blue-500/70 transition-colors duration-900 rounded  border border-blue-400/30 text-blue-100 text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>

            </div>
          </div>
        </nav>

        {/* =========================
            🔽 V-SHAPE TOGGLE
        ========================= */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-1/2 -translate-x-1/2 top-full w-16 h-8 flex items-start justify-center cursor-pointer bg-black/50 backdrop-blur-2xl hover:bg-black/30 transition-colors border-t-0 shadow-lg"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          aria-label="Toggle Navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-300 transition-transform duration-500 mt-1 ${
              !isOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* =========================
          📱 MOBILE SIDEBAR MENU
      ========================= */}
      {/* Background Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-black/70 border-l border-white/10 z-50 p-6 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-8">
          <span className="text-white font-bold tracking-widest uppercase">{appName}</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
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
        </div>
      </div>
    </>
  );
}