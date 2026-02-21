'use client';
import { useAuthStore } from '@/store/authStore';

export default function PerformancePage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-neutral-100">
            {/* Top Bar: Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                <div className="w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search bar ......."
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">Group by</button>
                    <button className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">Filter</button>
                    <button className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">Sort by...</button>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm font-medium">
                            <th className="p-4 text-pink-500 border-r border-neutral-800">Name</th>
                            <th className="p-4 text-pink-500 border-r border-neutral-800">License#</th>
                            <th className="p-4 text-pink-500 border-r border-neutral-800">Expiry</th>
                            <th className="p-4 text-pink-500 border-r border-neutral-800">Completion Rate</th>
                            <th className="p-4 text-pink-500 border-r border-neutral-800">Saftey Score</th>
                            <th className="p-4 text-pink-500">Complaints</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {[1, 2, 3].map((i) => (
                            <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">John</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">23223</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">22/36</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">92%</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">89%</td>
                                <td className="p-4 text-neutral-300">4</td>
                            </tr>
                        ))}
                        {[...Array(15)].map((_, i) => (
                            <tr key={i + 3} className="border-b border-neutral-800/20 last:border-0 font-bold">
                                <td colSpan="6" className="p-1 px-4 text-neutral-300 text-left select-none">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
