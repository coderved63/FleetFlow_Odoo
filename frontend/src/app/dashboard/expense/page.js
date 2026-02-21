'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Plus, X, Search, Filter, ArrowUpDown, Layers } from 'lucide-react';

export default function ExpensePage() {
    const { user, token } = useAuthStore();
    const [expenses, setExpenses] = useState([]);
    const [pendingTrips, setPendingTrips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        tripId: '', // Readable Trip ID
        driver: '',
        distance: 0,
        fuelCost: '',
        miscExpense: '0'
    });

    useEffect(() => {
        if (token) {
            fetchExpenses();
            fetchPendingTrips();
        }
    }, [token]);

    const fetchExpenses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setExpenses(data);
            }
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPendingTrips = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses/pending-trips', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPendingTrips(data);
            }
        } catch (error) {
            console.error('Failed to fetch pending trips', error);
        }
    };

    const handleTripSelect = (tripId) => {
        const trip = pendingTrips.find(t => t.tripId === tripId);
        if (trip) {
            setFormData({
                tripId: trip.tripId,
                driver: trip.driver?.name || 'Unknown',
                distance: trip.actualDistance || trip.estimatedDistance || 0,
                fuelCost: trip.actualFuelCost || 0,
                miscExpense: '0'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ tripId: '', driver: '', distance: 0, fuelCost: '', miscExpense: '0' });
                fetchExpenses();
                fetchPendingTrips();
                alert('Expense logged successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to log expense');
            }
        } catch (error) {
            alert('Network error occurred.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-neutral-100 pb-10">
            {/* Top Bar: Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                <div className="w-full md:w-1/2 flex items-center bg-neutral-950 border border-neutral-700 rounded-lg px-4 transition-focus-within focus-within:border-blue-500">
                    <Search className="text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search bar ......."
                        className="bg-transparent border-none w-full px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">
                        Group by
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">
                        <ArrowUpDown size={16} /> Sort by...
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            {user?.role === 'FINANCIAL_ANALYST' && (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Add an Expense
                    </button>
                </div>
            )}

            {/* Expense Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-xs">
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800">Trip ID</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800">Driver</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800">Distance</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800">Revenue</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800">Fuel Exp.</th>
                            <th className="p-4 font-bold text-pink-500 border-r border-neutral-800">Misc Exp.</th>
                            <th className="p-4 font-bold text-pink-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {expenses.length > 0 ? expenses.map((e) => (
                            <tr key={e.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300 font-medium">{e.tripId}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{e.driver}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{e.distance} km</td>
                                <td className="p-4 border-r border-neutral-800 text-emerald-400 font-bold">₹{(e.revenue || 0).toLocaleString()}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">₹{e.fuelCost.toLocaleString()}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">₹{e.miscExpense.toLocaleString()}</td>
                                <td className="p-4 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                                    <span className="bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Logged</span>
                                </td>
                            </tr>
                        )) : !isLoading && (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-neutral-500 font-medium italic">No expenses recorded.</td>
                            </tr>
                        )}
                        {isLoading && (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-neutral-500 font-medium">Fetching records...</td>
                            </tr>
                        )}
                        {[...Array(Math.max(0, 6 - expenses.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-neutral-800/30 last:border-0 h-14">
                                <td className="border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="text-neutral-600">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Expense Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-blue-500/5 rounded-t-3xl">
                            <h2 className="w-full text-lg font-bold text-white flex items-center justify-center gap-2">
                                <Layers className="text-blue-500" size={20} />
                                New Expense
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Select Trip ID:</label>
                                    <select
                                        required
                                        value={formData.tripId}
                                        onChange={(e) => handleTripSelect(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white transition-all appearance-none"
                                    >
                                        <option value="" disabled>Choose a completed trip...</option>
                                        {pendingTrips.map(trip => (
                                            <option key={trip.tripId} value={trip.tripId} className="bg-neutral-900">
                                                {trip.tripId} - {trip.driver?.name}
                                            </option>
                                        ))}
                                        {pendingTrips.length === 0 && <option disabled>No pending trips available</option>}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Driver:</label>
                                    <input
                                        readOnly
                                        type="text"
                                        value={formData.driver}
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-400 cursor-not-allowed"
                                        placeholder="Select a trip above..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Fuel Cost (₹):</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.fuelCost}
                                        onChange={(e) => setFormData({ ...formData, fuelCost: e.target.value })}
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                                        placeholder="Enter fuel cost"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Misc Expense (₹):</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.miscExpense}
                                        onChange={(e) => setFormData({ ...formData, miscExpense: e.target.value })}
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                                        placeholder="Enter other costs"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={!formData.tripId}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                                >
                                    Log Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border border-neutral-700 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
