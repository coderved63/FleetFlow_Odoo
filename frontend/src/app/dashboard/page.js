'use client';
import { useAuthStore } from '@/store/authStore';
import { Activity, AlertTriangle, PackageSearch } from 'lucide-react';

export default function MainDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Fleet Dashboard</h1>
                    <p className="text-neutral-400 mt-1">A quick, all-in-one screen to see exactly what's happening right now.</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-800 text-white transition-colors font-medium">
                        New Trip
                    </button>
                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors shadow-lg shadow-blue-500/20">
                        New Vehicle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm shadow-black/50 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-neutral-400 font-medium group-hover:text-neutral-300">Active Fleet</h3>
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                            <Activity className="text-emerald-500" size={24} />
                        </div>
                    </div>
                    <p className="text-5xl font-bold text-white tracking-tight">220</p>
                    <p className="text-sm font-medium text-emerald-400 mt-3">↑ Trucks on the road</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm shadow-black/50 hover:border-amber-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-neutral-400 font-medium group-hover:text-neutral-300">Maintenance Alerts</h3>
                        <div className="p-2.5 bg-amber-500/10 rounded-xl">
                            <AlertTriangle className="text-amber-500" size={24} />
                        </div>
                    </div>
                    <p className="text-5xl font-bold text-white tracking-tight">180</p>
                    <p className="text-sm font-medium text-amber-500 mt-3">Stuck in the shop for repairs</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm shadow-black/50 hover:border-blue-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-neutral-400 font-medium group-hover:text-neutral-300">Pending Cargo</h3>
                        <div className="p-2.5 bg-blue-500/10 rounded-xl">
                            <PackageSearch className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <p className="text-5xl font-bold text-white tracking-tight">20</p>
                    <p className="text-sm font-medium text-blue-400 mt-3">Waiting for assignment</p>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm shadow-black/50">
                <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                    <input
                        type="text"
                        placeholder="Search bar..."
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-72"
                    />
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">Group By</button>
                        <button className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">Filter</button>
                        <button className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">Sort By</button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800/80 text-xs uppercase tracking-wider text-neutral-500 bg-neutral-950/50 font-semibold">
                            <th className="p-5">Trip ID</th>
                            <th className="p-5">Vehicle</th>
                            <th className="p-5">Driver</th>
                            <th className="p-5 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors cursor-pointer">
                                <td className="p-5 text-white">TRP-{2000 + i}</td>
                                <td className="p-5 text-neutral-400">xxxxxxxxx{i}</td>
                                <td className="p-5 text-neutral-400">John Doe</td>
                                <td className="p-5 text-right">
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wide">
                                        On Trip
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
