'use client';

export default function SkeletonPage({ title = "Section Under Construction" }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-neutral-500 max-w-md">
                This portal is currently being synchronized with the fleet data engine.
                Advanced analytics and controls will be available shortly.
            </p>
            <div className="flex gap-2 mt-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-32 h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/20 animate-pulse" style={{ width: `${30 * i}%`, animationDelay: `${i * 0.2}s` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
