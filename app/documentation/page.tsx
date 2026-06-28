import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Documentation",
};

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Aether3D";
const githubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Dulaj007/3d-sim";

const steps = [
  {
    title: "Drop in a model",
    body: "Open the app and drag a .glb, .gltf, or .obj file onto the welcome card, or just click it to browse for one. As soon as your first model lands, the rest of the toolset shows up.",
  },
  {
    title: "Move, rotate, scale",
    body: "Use the pill at the bottom center to switch between Move, Rotate, and Scale, then drag the gizmo on your model to transform it.",
  },
  {
    title: "Bring in more models",
    body: "You can click the blue + button anytime to add another model. Every model you add shows up in the Objects panel on the left.",
  },
  {
    title: "Frame your shot",
    body: "Orbit, pan, and zoom with the mouse until you find an angle you like, then hit Camera in the top bar to lock it so your framing stays put while you work.",
  },
  {
    title: "Pick a mood",
    body: "Choose a lighting environment from the dropdown in the top bar, like Dawn, Sunset, Forest, or Studio, or upload your own .hdr/.exr file with the + button beside it.",
  },
  {
    title: "Dial in exact values",
    body: "If dragging the gizmo by eye isn't precise enough, open the Inspector panel on the right and type in exact position, rotation, and scale numbers.",
  },
  {
    title: "Save checkpoints",
    body: "Select an object in the Objects panel and hit Save Point to capture its position, rotation, scale, and the current camera angle. Save a few of these in sequence and you've basically got keyframes for an animation.",
  },
  {
    title: "Export your scene",
    body: "Click Export in the top bar to download everything, every object, transform, and checkpoint, as a single JSON file.",
  },
];

const tips = [
  "Chain a few save points per object together to rough out a camera-driven animation sequence.",
  "Lock the camera before fine-tuning multiple objects, so every checkpoint shares the same framing.",
  "Use the Inspector when you need exact placement instead of eyeballing it with the gizmo.",
  "The exported JSON includes every transform and checkpoint, so you can pair it with your own Three.js or React Three Fiber scene to reconstruct the layout in code.",
  'You can replay this walkthrough anytime in the app from the "?" icon next to the camera lock control.',
];

export default function DocumentationPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white px-6 py-16 overflow-hidden">
      {/* Floating ambient bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/25 blur-[100px] animate-float-a" />
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-indigo-600/20 blur-[110px] animate-float-b" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px] animate-float-c" style={{ animationDelay: "-8s" }} />
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-[90px] animate-float-b" style={{ animationDelay: "-12s" }} />
        <div className="absolute bottom-1/4 -left-16 w-72 h-72 rounded-full bg-blue-500/15 blur-[100px] animate-float-a" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* =========================
            TOP BAR
        ========================= */}
        <div className="flex items-center justify-between gap-3 mb-16 animate-fade-in-up">
          <span className="font-display text-base md:text-lg font-semibold tracking-tight truncate">
            {appName}
          </span>
          <div className="flex items-center gap-3 md:gap-4 flex-none">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              title="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            <Link
              href="/"
              title="Back to viewer"
              className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              <span className="hidden sm:inline">Back to viewer</span>
            </Link>
          </div>
        </div>

        {/* =========================
            HERO
        ========================= */}
        <div className="mb-16 animate-fade-in-up">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Everything you need to arrange, animate, and export 3D scenes with {appName}.
          </p>
        </div>

        {/* =========================
            WHAT IS THIS?
        ========================= */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-4">What is this?</h2>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              {appName} is a 3D scene editor that runs entirely in your browser. You can drop in
              one or more 3D models, arrange them in real time, light the scene with an
              environment preset (or your own HDRI), and save checkpoints of how everything,
              including the camera, is positioned. Chain a few of those checkpoints together and
              you&rsquo;ve got the keyframes for an animation. Once you&rsquo;re happy with it, export the
              whole scene as a single JSON file to use in your own project.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              It&rsquo;s meant for quick 3D layout work, things like prototyping a scene, planning out
              a game environment, or putting together the transform data behind a scroll or
              camera-driven animation, without having to install a full 3D editor.
            </p>
          </div>
        </section>

        {/* =========================
            FEATURES
        ========================= */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-4">Key features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Multi-model editing", body: "Upload and place several models in one scene, and move, rotate, or scale each one independently." },
              { title: "Environment and lighting", body: "Switch between HDRI presets or upload your own .hdr/.exr environment map." },
              { title: "Save points (keyframes)", body: "Capture an object's transform plus the camera state at any moment, then restore it later." },
              { title: "Scene export", body: "Download the full scene, including models, transforms, and checkpoints, as one JSON file." },
              { title: "Inspector panel", body: "Read and edit exact position, rotation, and scale values for the selected object and camera." },
              { title: "Objects panel", body: "See every model in the scene and every checkpoint saved against it, and restore any of them with one click." },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
              >
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================
            STEP-BY-STEP GUIDE
        ========================= */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-4">How to use it</h2>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex-none w-7 h-7 rounded-full bg-blue-600/80 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* =========================
            GETTING THE MOST OUT OF IT
        ========================= */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-4">Getting the most out of it</h2>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <ul className="space-y-3">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-none mt-0.5 text-emerald-400">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =========================
            TEST CASE
        ========================= */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Test case: export &amp; reconstruction accuracy
          </h2>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              To confirm the exported JSON reliably reproduces a scene, two butterfly models and
              a tree branch were arranged, transformed, and saved from a specific camera angle in
              the editor (below). The exported file was then loaded into a fresh scene with no
              manual adjustments.
            </p>

            <div className="rounded-xl overflow-hidden border border-white/10 mb-3">
              <Image
                src="/docs/editor-view.webp"
                alt="Editor view with two butterflies and a branch arranged on a save point"
                width={1280}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-gray-500 mb-6">Original scene, arranged in the editor.</p>

            <div className="rounded-xl overflow-hidden border border-white/10 mb-3">
              <Image
                src="/docs/reconstructed-scene.webp"
                alt="Reconstructed scene loaded from the exported JSON, matching the original"
                width={1280}
                height={519}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Same scene, rebuilt purely from the exported JSON. Model placement, rotation,
              scale, and camera perspective all match.
            </p>

            <p className="text-sm text-gray-300 leading-relaxed mb-2">
              <strong className="text-white">Result:</strong> the reconstructed scene matched the
              original exactly, confirming the export format can be safely stored and replayed
              for full scene reconstruction.
            </p>
            <a
              href={`${githubUrl}/issues/20`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-300 hover:text-blue-200 transition-colors"
            >
              View the full test case on GitHub
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </div>
        </section>

        {/* =========================
            DISCLAIMER
        ========================= */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Disclaimer</h2>
          <div className="bg-amber-500/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 md:p-8">
            <div className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-amber-400 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div className="text-sm text-amber-100/90 leading-relaxed space-y-3">
                <p>
                  Everything in {appName} runs locally in your browser. Models you upload are
                  never sent to a server. They&rsquo;re loaded from a temporary URL that only exists
                  for your current browser tab.
                </p>
                <p>
                  That means <strong>nothing is saved automatically</strong>. Refreshing the page,
                  closing the tab, or navigating away clears every model, transform, and save
                  point. There is no account, no cloud storage, and no auto-save.
                </p>
                <p>
                  Always keep your own copy of any 3D model that matters to you before uploading
                  it here, and use <strong>Export</strong> to download your scene data before
                  closing the tab if you want to keep your work. We aren&rsquo;t responsible for models
                  or scene data lost when a session ends.
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-gray-600 pb-4">
          Source code and issue tracker on{" "}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            GitHub
          </a>
          .
        </p>
      </div>
    </main>
  );
}
