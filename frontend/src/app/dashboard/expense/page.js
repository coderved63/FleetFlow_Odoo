'use client';
import { useAuthStore } from '@/store/authStore';
import { Plus } from 'lucide-react';

export default function ExpensePage() {
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
            {user?.role !== 'ADMIN' && (
                <div className="flex justify-end gap-3">
                    <button className="flex items-center gap-2 px-5 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors">
                        <Plus size={16} />
                        Add an Expense
                    </button>
                </div>
            )}

            {/* Expense Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm">
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Trip ID</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Driver</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Distance</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Fuel Expense</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Misc. Expen</th>
                            <th className="p-4 font-medium text-pink-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">321</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">John</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">1000 km</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">19k</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">3k</td>
                            <td className="p-4 text-neutral-300">Done</td>
                        </tr>
                        {[...Array(6)].map((_, i) => (
                            <tr key={i} className="border-b border-neutral-800/30 last:border-0">
                                <td colSpan="6" className="p-4 text-neutral-300 text-center leading-none select-none">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
