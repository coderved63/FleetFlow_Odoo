'use client';
import { useAuthStore } from '@/store/authStore';

export default function MainDashboard() {
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <button className="px-5 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors">
                    New Trip
                </button>
                <button className="px-5 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors">
                    New Vehicle
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                    <h3 className="text-emerald-400 text-xl font-medium mb-4">Active Fleet</h3>
                    <p className="text-emerald-400 text-5xl font-semibold">220</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                    <h3 className="text-emerald-400 text-xl font-medium mb-4">Maintenance Alert</h3>
                    <p className="text-emerald-400 text-5xl font-semibold">180</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                    <h3 className="text-emerald-400 text-xl font-medium mb-4">Pending Cargo</h3>
                    <p className="text-emerald-400 text-5xl font-semibold">20</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm">
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800 w-1/4">Trip</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800 w-1/4">Vehicle</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800 w-1/4">Driver</th>
                            <th className="p-4 font-medium text-pink-500 w-1/4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">
                                    {i === 1 ? '1' : '•'}
                                </td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300 tracking-widest">
                                    {i === 1 ? 'xxxxxxxxxxxxxxx' : '•'}
                                </td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">
                                    {i === 1 ? 'John Doe' : '•'}
                                </td>
                                <td className="p-4 text-orange-400 font-medium tracking-wide">
                                    {i === 1 ? 'On Trip' : '•'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
