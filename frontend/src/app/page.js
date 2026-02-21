export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
        FleetFlow 🚀
      </h1>
      <p className="text-neutral-400 text-lg mb-8 text-center max-w-lg">
        Modular Fleet & Logistics Management System. Replace inefficient, manual logbooks with a centralized, rule-based digital hub.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium">
          Dashboard
        </button>
        <button className="px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors font-medium border border-neutral-700">
          Login
        </button>
      </div>
    </main>
  );
}
