'use client';
import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function VehicleRegistryPage() {
    const { user } = useAuthStore();
    const [isFormOpen, setIsFormOpen] = useState(false);

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
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={16} />
                        New Vehicle
                    </button>
                </div>
            )}

            {/* Vehicle Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm">
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">NO</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Plate</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Model</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Type</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Capacity</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Odometer</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Status</th>
                            <th className="p-4 font-medium text-pink-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">1</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">MH 00</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">2017</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">Mini</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">5 tonn</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300">79000</td>
                            <td className="p-4 border-r border-neutral-800 text-neutral-300 underline decoration-amber-500 underline-offset-4">Idle</td>
                            <td className="p-4 text-orange-400 font-medium">
                                <button className="p-1 hover:bg-neutral-700 rounded transition-colors text-orange-500">
                                    <X size={16} />
                                </button>
                            </td>
                        </tr>
                        {[2, 3, 4, 5, 6].map((i) => (
                            <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300 flex justify-center">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">•</td>
                                <td className="p-4 text-neutral-300">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal: New Vehicle Registration */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">New Vehicle Registration</h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">License Plate:</label>
                                    <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Max Payload:</label>
                                    <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Initial Odometer:</label>
                                    <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Type:</label>
                                    <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Model:</label>
                                    <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-8 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
