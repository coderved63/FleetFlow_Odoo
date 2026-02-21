'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function VehicleRegistryPage() {
    const { user, token } = useAuthStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const initialFormState = {
        plate: '',
        model: '',
        capacity: '',
        acquisitionCost: '',
        type: '',
        odometer: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchVehicles = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/vehicles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVehicles(data);
            }
        } catch (error) {
            console.error('Failed to fetch vehicles', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async (vehicleId, currentStatus) => {
        const newStatus = currentStatus === 'Out of Service' ? 'Available' : 'Out of Service';
        try {
            const res = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchVehicles(); // Refresh the list
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Failed to toggle status', error);
            alert('Network error occurred.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    licensePlate: formData.plate,
                    name: formData.model,
                    maxLoadCapacity: formData.capacity,
                    acquisitionCost: formData.acquisitionCost,
                    type: formData.type,
                    odometer: formData.odometer,
                    status: 'Available' // Default status
                }) // type added here
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Vehicle registered successfully!');
                setFormData(initialFormState);
                fetchVehicles();
                setTimeout(() => {
                    setIsFormOpen(false);
                    setMessage('');
                }, 2000);
            } else {
                setMessage(data.error || 'Failed to register vehicle');
            }
        } catch (err) {
            setMessage('Network error occurred.');
        }
    };

    useEffect(() => {
        if (token) {
            fetchVehicles();
        }
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
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Vehicle</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Type</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Capacity</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Acquisition Cost</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Odometer</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Status</th>
                            {user?.role !== 'DISPATCHER' && (
                                <th className="p-4 font-medium text-pink-500">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vehicles.map((v, index) => (
                            <tr key={v.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{index + 1}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{v.licensePlate}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{v.name}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{v.type || '-'}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{v.maxLoadCapacity} kg</td>
                                <td className="p-4 border-r border-neutral-800 text-emerald-400 font-medium">${v.acquisitionCost || 0}</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-300">{v.odometer}</td>
                                <td className={`p-4 font-medium border-r border-neutral-800 ${v.status === 'Available' ? 'text-emerald-400' :
                                    v.status === 'Out of Service' ? 'text-neutral-500' :
                                        v.status === 'In Shop' ? 'text-orange-400' :
                                            'text-blue-400'
                                    }`}>{v.status}</td>
                                {user?.role !== 'DISPATCHER' && (
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleStatus(v.id, v.status)}
                                            disabled={v.status === 'On Trip'} // Cannot retire a vehicle currently on a trip
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${v.status === 'Out of Service'
                                                ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10'
                                                : v.status === 'On Trip'
                                                    ? 'border-neutral-700 text-neutral-600 cursor-not-allowed'
                                                    : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                                                }`}
                                            title={v.status === 'On Trip' ? "Cannot modify status while on trip" : ""}
                                        >
                                            {v.status === 'Out of Service' ? 'Reactivate' : 'Retire'}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {vehicles.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-neutral-500 font-medium">No vehicles found. Click 'New Vehicle' to add one.</td>
                            </tr>
                        )}
                        {isLoading && (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-neutral-500 font-medium">Loading vehicles...</td>
                            </tr>
                        )}
                        {/* Placeholder empty dots for aesthetic padding */}
                        {[...Array(Math.max(0, 5 - vehicles.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="hover:bg-neutral-800/30 transition-colors">
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
                        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">License Plate:</label>
                                    <input required type="text" value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. MH-01-AB-1234" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Model Name:</label>
                                    <input required type="text" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Tata Ace Gold" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Max Payload (kg):</label>
                                    <input required type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 750" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Acquisition Cost ($):</label>
                                    <input required type="number" value={formData.acquisitionCost} onChange={e => setFormData({ ...formData, acquisitionCost: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 50000" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Initial Odometer:</label>
                                    <input required type="number" value={formData.odometer} onChange={e => setFormData({ ...formData, odometer: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 15000" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <label className="text-neutral-300 text-sm whitespace-nowrap w-32">Vehicle Type:</label>
                                    <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white">
                                        <option value="" disabled>Select vehicle type...</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Van">Van</option>
                                        <option value="Bike">Bike</option>
                                    </select>
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
