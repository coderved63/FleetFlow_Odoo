'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Plus, X } from 'lucide-react';

export default function MaintenancePage() {
    const { user, token } = useAuthStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]); // Needed for the dropdown to select which vehicle to service
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        vehicleId: '',
        serviceType: '',
        cost: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/maintenance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch maintenance logs', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/vehicles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // We show all vehicles, even In Shop, because maybe they are adding another log for it.
                // Or maybe only Available vehicles can be sent to shop? The rules say "When maintenance is logged: Vehicle -> IN_SHOP"
                setVehicles(data);
            }
        } catch (error) {
            console.error('Failed to fetch vehicles', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLogs();
            fetchVehicles();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/maintenance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicleId: formData.vehicleId,
                    serviceType: formData.serviceType,
                    cost: formData.cost,
                    description: formData.description,
                    date: formData.date,
                    status: 'In Progress'
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Service logged successfully! Vehicle moved to IN SHOP.');
                setFormData({ vehicleId: '', serviceType: '', cost: '', description: '', date: new Date().toISOString().split('T')[0] });
                fetchLogs(); // Refresh the list
                setTimeout(() => {
                    setIsFormOpen(false);
                    setMessage('');
                }, 2000);
            } else {
                setMessage(data.error || 'Failed to log service');
            }
        } catch (err) {
            setMessage('Network error occurred.');
        }
    };

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
                        Create New Service
                    </button>
                </div>
            )}

            {/* Maintenance Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8 shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm">
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Log ID</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Vehicle</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Issue/Service</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Date</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Cost</th>
                            <th className="p-4 font-medium text-pink-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-blue-400 font-medium">{log.id}</td>
                                <td className="p-4 border-r border-neutral-800 text-blue-400 font-medium">
                                    {log.vehicle ? `${log.vehicle.name} (${log.vehicle.licensePlate})` : 'Unknown'}
                                </td>
                                <td className="p-4 border-r border-neutral-800 text-blue-400 font-medium">{log.serviceType} / {log.description}</td>
                                <td className="p-4 border-r border-neutral-800 text-blue-400 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                                <td className="p-4 border-r border-neutral-800 text-blue-400 font-medium">${log.cost}</td>
                                <td className="p-4 text-orange-400 font-medium pointer-events-none">{log.status}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-neutral-500 font-medium">No service logs found. Click 'Create New Service' to add one.</td>
                            </tr>
                        )}
                        {isLoading && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-neutral-500 font-medium">Loading service logs...</td>
                            </tr>
                        )}
                        {[...Array(Math.max(0, 10 - logs.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/10 transition-colors">
                                <td colSpan="6" className="p-3 text-neutral-300 text-center leading-none select-none flex justify-center">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal: New Service Record */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">New Service</h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Vehicle Name:</label>
                                    <select
                                        required
                                        value={formData.vehicleId}
                                        onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                                    >
                                        <option value="" disabled>Select a vehicle...</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>{v.name} ({v.licensePlate}) - {v.status}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Issue/service:</label>
                                    <input required type="text" value={formData.serviceType} onChange={e => setFormData({ ...formData, serviceType: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Oil Change, Brake Repair" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Date:</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
                                </div>
                                {/* Retaining cost estimate as it is displayed in the table */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Cost Estimate ($):</label>
                                    <input required type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 250" />
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
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
