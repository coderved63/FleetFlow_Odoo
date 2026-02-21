export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 -z-10"></div>

      <div className="text-center max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-block mb-6 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          v1.0 is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Next-Gen <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent pb-2">
            Fleet Intelligence
          </span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Replace inefficient, manual logbooks with a centralized, rule-based digital hub that optimizes the lifecycle of your delivery fleet, monitors driver safety, and tracks financial performance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 relative overflow-hidden group">
            <span className="relative z-10">Enter Command Center</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          </a>
          <a href="#features" className="px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium border border-neutral-800 transition-all hover:border-neutral-700">
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}
