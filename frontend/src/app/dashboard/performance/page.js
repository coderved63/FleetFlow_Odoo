'use client';
import { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle2, X, UserPlus, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PerformancePage() {
    const { user, token } = useAuthStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Changed formData to match backend expectations for drivers
    const [formData, setFormData] = useState({
        name: '',
        license: '',
        expiry: ''
    });

    const fetchDrivers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/drivers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDrivers(data);
            }
        } catch (error) {
            console.error('Failed to fetch drivers', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    // The backend expects licenseExpiry as a date.
                    licenseExpiry: formData.expiry,
                    status: 'On Duty'
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Driver registered successfully!');
                setFormData({ name: '', license: '', expiry: '' });
                fetchDrivers();
                setTimeout(() => {
                    setIsFormOpen(false);
                    setMessage('');
                }, 2000);
            } else {
                setMessage(data.error || 'Failed to register driver');
            }
        } catch (err) {
            setMessage('Network error occurred.');
        }
    };

    useEffect(() => {
        if (token) {
            fetchDrivers();
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
                        {drivers.map((d, index) => {
                            // Backend `Driver` model has id, name, licenseExpiry, status.
                            // The `License` relation might not be fully fetched without an `include` in backend,
                            // but for now we map what we have. We'll use dummy data for completionRate/safetyScore 
                            // until Analytics phase.
                            return (
                                <tr key={d.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                    <td className="p-4 border-r border-neutral-800 text-neutral-300">{d.name}</td>
                                    <td className="p-4 border-r border-neutral-800 text-neutral-300">N/A</td>
                                    <td className="p-4 border-r border-neutral-800 text-neutral-300">
                                        {d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4 border-r border-neutral-800 text-neutral-300 text-emerald-400">100% (New)</td>
                                    <td className="p-4 border-r border-neutral-800 text-neutral-300 text-blue-400">100/100</td>
                                    <td className="p-4 text-neutral-300 underline decoration-amber-500 underline-offset-4">{d.status}</td>
                                </tr>
                            );
                        })}
                        {drivers.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-neutral-500 font-medium">No driver profiles found. Click 'Onboard Driver' to hire.</td>
                            </tr>
                        )}
                        {isLoading && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-neutral-500 font-medium">Loading drivers...</td>
                            </tr>
                        )}
                        {/* Placeholder empty dots for aesthetic padding */}
                        {[...Array(Math.max(0, 5 - drivers.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="hover:bg-neutral-800/30 transition-colors">
                                <td className="p-4 border-r border-neutral-800 text-neutral-300 flex justify-center">•</td>
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
        </div>
    );
}
