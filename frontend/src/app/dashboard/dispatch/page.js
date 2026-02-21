'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function TripDispatcherPage() {
    const { user } = useAuthStore();

    // Placeholder data - this will be replaced by backend API call
    const [trips, setTrips] = useState([
        { id: 1, type: 'Trailer Truck', origin: 'Mumbai', destination: 'Pune', status: 'On way' }
    ]);

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

            {/* Trip Status Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm">
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800 w-[10%]">Trip</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Fleet Type</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Origin</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Destination</th>
                            <th className="p-4 font-medium text-pink-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {trips.map((t) => (
                            <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.id}</td>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.type}</td>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.origin}</td>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.destination}</td>
                                <td className="p-4 text-red-500 font-semibold underline underline-offset-4 decoration-red-500/50">{t.status}</td>
                            </tr>
                        ))}
                        {trips.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-neutral-500 font-medium">No trips active.</td>
                            </tr>
                        )}
                        {[...Array(Math.max(0, 5 - trips.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="hover:bg-neutral-800/30 transition-colors border-b border-neutral-800/30 last:border-0">
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

            {/* New Trip Form - Bottom of Page */}
            {user?.role !== 'ADMIN' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
                    <div className="mb-6">
                        <span className="px-4 py-1.5 border border-emerald-500 text-emerald-500 rounded-lg text-sm font-medium">
                            New Trip Form
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-neutral-300 text-sm whitespace-nowrap w-40">Select Vehicle:</label>
                            <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-neutral-300 text-sm whitespace-nowrap w-40">Cargo Weight (Kg):</label>
                            <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-neutral-300 text-sm whitespace-nowrap w-40">Select Driver:</label>
                            <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-neutral-300 text-sm whitespace-nowrap w-40">Origin Address:</label>
                            <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-neutral-300 text-sm whitespace-nowrap w-40">Destination:</label>
                            <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-neutral-300 text-sm whitespace-nowrap w-40">Estimated Fuel Cost:</label>
                            <input type="text" className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-start">
                        <button className="px-6 py-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 rounded-xl text-sm font-medium transition-colors">
                            Confirm & Dispatch Trip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
