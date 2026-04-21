export default function SplashPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Loading 3D Simulator...</h1>

      <div className="w-40 h-1 bg-gray-800 rounded overflow-hidden">
        <div className="h-full bg-white animate-pulse w-full" />
      </div>

      <p className="text-gray-500 mt-4 text-sm">
        Preparing assets...
      </p>
    </main>
  );
}