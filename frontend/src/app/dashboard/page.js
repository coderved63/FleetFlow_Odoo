'use client';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainDashboard() {
    const { user, token } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState({
        activeFleet: 0,
        vehiclesInShop: 0,
        utilizationRate: 0,
        maintenanceAlerts: 0,
        pendingCargoWeight: 0,
        pendingCargoValue: 0,
        recentTrips: []
    });

    useEffect(() => {
        if (user?.role === 'FINANCIAL_ANALYST') {
            router.push('/dashboard/analytics');
        }
    }, [user, router]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to load dashboard statistics:", error);
            }
        };

        if (token) fetchStats();
    }, [token]);

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
                {(user?.role === 'ADMIN' || user?.role === 'DISPATCHER') && (
                    <Link href="/dashboard/dispatch" className="px-5 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors">
                        New Trip
                    </Link>
                )}
                {(user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER') && (
                    <Link href="/dashboard/vehicles" className="px-5 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors">
                        New Vehicle
                    </Link>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-sm transition-transform hover:scale-[1.02]">
                    <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Active Fleet (On Trip)</h3>
                    <p className="text-blue-400 text-4xl font-semibold">{stats.activeFleet}</p>
                </div>
                {user?.role !== 'DISPATCHER' && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-sm transition-transform hover:scale-[1.02]">
                        <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Vehicles In Shop</h3>
                        <p className="text-orange-400 text-4xl font-semibold">{stats.vehiclesInShop}</p>
                    </div>
                )}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-sm transition-transform hover:scale-[1.02]">
                    <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Fleet Utilization Rate</h3>
                    <p className="text-emerald-400 text-4xl font-semibold">{stats.utilizationRate}%</p>
                </div>
                {user?.role !== 'DISPATCHER' && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-sm transition-transform hover:scale-[1.02]">
                        <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Maintenance Alerts</h3>
                        <p className="text-red-400 text-4xl font-semibold">{stats.maintenanceAlerts}</p>
                    </div>
                )}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-sm transition-transform hover:scale-[1.02] md:col-span-2">
                    <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Pending Cargo Overview</h3>
                    <div className="flex gap-4 md:gap-8 items-end flex-wrap">
                        <p className="text-purple-400 text-4xl font-semibold">₹{(stats.pendingCargoValue).toLocaleString()}</p>
                        <p className="text-neutral-400 text-xl font-medium mb-1 border-l border-neutral-700 pl-4 md:pl-8">{(stats.pendingCargoWeight / 1000).toFixed(1)} tons en route</p>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <div className="p-4 border-b border-neutral-800 bg-neutral-950/50">
                    <h3 className="text-lg font-bold text-white tracking-wide">Recent Trip Activity</h3>
                </div>
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm bg-neutral-950/30">
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800 w-1/4">Trip Ref</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800 w-1/4">Vehicle</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800 w-1/4">Driver</th>
                            <th className="p-4 font-bold text-pink-500 w-1/4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {stats.recentTrips.length > 0 ? stats.recentTrips.map((trip) => (
                            <tr key={trip.id} className="hover:bg-neutral-800/30 transition-colors border-b border-neutral-800/50 last:border-0">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300 font-medium">
                                    {trip.tripId}
                                </td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-400 tracking-wide">
                                    {trip.vehicle?.name || trip.vehicle?.licensePlate || 'N/A'}
                                </td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-400">
                                    {trip.driver?.name || 'N/A'}
                                </td>
                                <td className="p-4 font-medium tracking-wide">
                                    {trip.status === 'Completed' ? (
                                        <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{trip.status}</span>
                                    ) : trip.status === 'Dispatched' ? (
                                        <span className="text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">On Trip</span>
                                    ) : (
                                        <span className="text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">{trip.status}</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="p-8 text-neutral-500 italic">No recent activity detected.</td>
                            </tr>
                        )}
                        {[...Array(Math.max(0, 5 - stats.recentTrips.length))].map((_, i) => (
                            <tr key={`filler-${i}`} className="border-b border-neutral-800/30 last:border-0 h-14">
                                <td className="border-r border-neutral-800 text-neutral-700 font-bold">•</td>
                                <td className="border-r border-neutral-800 text-neutral-700 font-bold">•</td>
                                <td className="border-r border-neutral-800 text-neutral-700 font-bold">•</td>
                                <td className="text-neutral-700 font-bold">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
