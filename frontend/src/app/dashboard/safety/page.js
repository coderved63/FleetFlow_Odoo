'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
    ShieldAlert, Search, Plus, X, AlertTriangle, ChevronDown,
    FileWarning, Clock, CheckCircle, UserX, RefreshCw, ScrollText
} from 'lucide-react';

// ─── STATUS PILLS ──────────────────────────────────────────────────────────────
function DutyPill({ status }) {
    const map = {
        ON_DUTY:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        BREAK:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        SUSPENDED: 'bg-red-500/15 text-red-400 border-red-500/30',
    };
    const label = { ON_DUTY: 'On Duty', BREAK: 'Break', SUSPENDED: 'Suspended' };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
            {label[status] ?? status}
        </span>
    );
}

function AvailabilityPill({ status }) {
    const map = {
        AVAILABLE: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        ON_TRIP:   'bg-violet-500/15 text-violet-400 border-violet-500/30',
    };
    const label = { AVAILABLE: 'Available', ON_TRIP: 'On Trip' };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
            {label[status] ?? status}
        </span>
    );
}

function SafetyBar({ score }) {
    const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`text-xs font-bold ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : score >= 40 ? 'text-orange-400' : 'text-red-400'}`}>
                {score}
            </span>
        </div>
    );
}

function ExpiryBadge({ expiry }) {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
        return <span className="flex items-center gap-1 text-xs font-bold text-red-400"><FileWarning size={12} /> Expired</span>;
    }
    if (daysLeft <= 30) {
        return <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400"><Clock size={12} /> {daysLeft}d left</span>;
    }
    return <span className="text-xs text-neutral-400">{expiryDate.toLocaleDateString()}</span>;
}

// ─── MODALS ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function CreateDriverModal({ token, onClose, onCreated }) {
    const [form, setForm] = useState({
        name: '', licenseNumber: '', licenseCategory: 'TRUCK',
        licenseExpiry: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/safety/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create driver');
            onCreated();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    const labelCls = "block text-sm font-medium text-neutral-400 mb-1.5 ml-1";

    return (
        <Modal title="Add New Driver" onClose={onClose}>
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className={labelCls}>Full Name</label>
                    <input required className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                    <label className={labelCls}>License Number</label>
                    <input required className={inputCls} value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} />
                </div>
                <div>
                    <label className={labelCls}>License Category</label>
                    <select className={inputCls} value={form.licenseCategory} onChange={e => setForm({ ...form, licenseCategory: e.target.value })}>
                        <option value="TRUCK">Truck</option>
                        <option value="VAN">Van</option>
                        <option value="BIKE">Bike</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>License Expiry Date</label>
                    <input required type="date" className={inputCls} value={form.licenseExpiry} onChange={e => setForm({ ...form, licenseExpiry: e.target.value })} />
                </div>
                <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-2">
                    {loading ? 'Creating...' : 'Create Driver'}
                </button>
            </form>
        </Modal>
    );
}

function IncidentModal({ driver, token, onClose, onRefresh }) {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ type: 'COMPLAINT', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/api/safety/drivers/${driver.id}/incidents`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setIncidents(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [driver.id, token]);

    const addIncident = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5000/api/safety/drivers/${driver.id}/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to log incident');
            setIncidents(prev => [data.incident, ...prev]);
            setForm({ type: 'COMPLAINT', description: '' });
            onRefresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const typeColors = { LATE: 'text-yellow-400', COMPLAINT: 'text-orange-400', MINOR: 'text-red-400', MAJOR: 'text-red-600' };
    const inputCls = "w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500";

    return (
        <Modal title={`Incident Log — ${driver.name}`} onClose={onClose}>
            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                {/* Log New Incident */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Log New Incident</p>
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <form onSubmit={addIncident} className="space-y-3">
                        <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="LATE">Late Trip (−5 pts)</option>
                            <option value="COMPLAINT">Customer Complaint (−10 pts)</option>
                            <option value="MINOR">Minor Incident (−15 pts)</option>
                            <option value="MAJOR">Major Incident (−30 pts)</option>
                        </select>
                        <textarea required rows={2} placeholder="Description…" className={inputCls + ' resize-none'} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        <button type="submit" disabled={submitting}
                            className="w-full bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                            {submitting ? 'Logging…' : 'Log Incident'}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Incident History</p>
                    {loading && <p className="text-neutral-500 text-sm">Loading…</p>}
                    {!loading && incidents.length === 0 && <p className="text-neutral-500 text-sm italic">No incidents recorded.</p>}
                    <div className="space-y-2">
                        {incidents.map(inc => (
                            <div key={inc.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold uppercase ${typeColors[inc.type]}`}>{inc.type}</span>
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                        <span className="text-red-400 font-semibold">−{inc.severityScore} pts</span>
                                        <span>·</span>
                                        <span>{new Date(inc.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p className="text-neutral-300 text-xs mt-1.5">{inc.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SafetyPage() {
    const { token, user } = useAuthStore();
    const isReadOnly = user?.role === 'FLEET_MANAGER';
    const canAccess = ['SAFETY_OFFICER', 'FLEET_MANAGER', 'ADMIN'].includes(user?.role);

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Controls
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Modals
    const [showCreate, setShowCreate] = useState(false);
    const [incidentDriver, setIncidentDriver] = useState(null);

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.set('status', filterStatus);
            if (search) params.set('search', search);
            if (sortBy) params.set('sortBy', sortBy);
            const res = await fetch(`http://localhost:5000/api/safety/drivers?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setDrivers(Array.isArray(data) ? data : []);
        } catch {
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    }, [token, filterStatus, search, sortBy]);

    useEffect(() => {
        if (token && canAccess) fetchDrivers();
    }, [fetchDrivers, token, canAccess]);

    const changeStatus = async (driverId, dutyStatus) => {
        await fetch(`http://localhost:5000/api/safety/drivers/${driverId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ dutyStatus })
        });
        fetchDrivers();
    };

    if (!canAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <AlertTriangle className="text-red-400" size={36} />
                <p className="text-red-400 font-semibold">Access Restricted</p>
                <p className="text-neutral-500 text-sm">This module is only accessible by Safety Officers and Fleet Managers.</p>
            </div>
        );
    }

    // Summary stats
    const stats = [
        { label: 'Total Drivers', value: drivers.length, icon: <CheckCircle size={18} className="text-blue-400" />, color: 'text-blue-400' },
        { label: 'Suspended', value: drivers.filter(d => d.dutyStatus === 'SUSPENDED').length, icon: <UserX size={18} className="text-red-400" />, color: 'text-red-400' },
        { label: 'Expiring Soon', value: drivers.filter(d => { const days = Math.ceil((new Date(d.licenseExpiry) - new Date()) / 86400000); return days >= 0 && days <= 30; }).length, icon: <Clock size={18} className="text-yellow-400" />, color: 'text-yellow-400' },
        { label: 'Flagged (<60)', value: drivers.filter(d => d.safetyScore < 60).length, icon: <AlertTriangle size={18} className="text-orange-400" />, color: 'text-orange-400' },
    ];

    const selectCls = "bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <ShieldAlert size={22} className="text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Driver Performance & Safety</h1>
                    </div>
                    <p className="text-neutral-400 mt-2 ml-1">
                        {isReadOnly ? '📖 Read-only access — Fleet Manager view' : 'Compliance management, safety scoring and duty control.'}
                    </p>
                </div>
                {!isReadOnly && (
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
                        <Plus size={16} /> Add Driver
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-neutral-800">{s.icon}</div>
                        <div>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text" placeholder="Search by name or license…"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Filter */}
                    <select className={selectCls} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="ON_DUTY">On Duty</option>
                        <option value="BREAK">On Break</option>
                        <option value="SUSPENDED">Suspended</option>
                    </select>
                    {/* Sort */}
                    <select className={selectCls} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Sort: Default</option>
                        <option value="safetyScore">Sort: Safety Score</option>
                        <option value="expiryDate">Sort: Expiry Date</option>
                    </select>
                    <button onClick={fetchDrivers} className="p-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 bg-neutral-950/60">
                                <th className="p-4 pl-6 font-semibold">Driver</th>
                                <th className="p-4 font-semibold">License</th>
                                <th className="p-4 font-semibold">Expiry</th>
                                <th className="p-4 font-semibold">Safety Score</th>
                                <th className="p-4 font-semibold">Complaints</th>
                                <th className="p-4 font-semibold">Duty Status</th>
                                <th className="p-4 font-semibold">Availability</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={8} className="p-10 text-center text-neutral-500">Loading drivers…</td></tr>
                            )}
                            {!loading && drivers.length === 0 && (
                                <tr><td colSpan={8} className="p-10 text-center text-neutral-500 italic">No drivers found.</td></tr>
                            )}
                            {drivers.map(driver => {
                                const isSuspended = driver.dutyStatus === 'SUSPENDED';
                                const daysLeft = Math.ceil((new Date(driver.licenseExpiry) - new Date()) / 86400000);
                                const isExpiringSoon = daysLeft >= 0 && daysLeft <= 30;
                                const isFlagged = driver.safetyScore < 60;

                                return (
                                    <tr key={driver.id} className={`border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors ${isSuspended ? 'opacity-70' : ''}`}>
                                        {/* Driver */}
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSuspended ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {driver.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white flex items-center gap-1.5">
                                                        {driver.name}
                                                        {isFlagged && !isSuspended && <AlertTriangle size={12} className="text-orange-400" />}
                                                    </div>
                                                    <div className="text-neutral-500 text-xs">{driver.licenseCategory ?? 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* License */}
                                        <td className="p-4">
                                            <span className="font-mono text-xs text-neutral-300">{driver.licenseNumber ?? <span className="text-neutral-600 italic">Not set</span>}</span>
                                        </td>
                                        {/* Expiry */}
                                        <td className="p-4">
                                            <ExpiryBadge expiry={driver.licenseExpiry} />
                                        </td>
                                        {/* Safety Score */}
                                        <td className="p-4">
                                            <SafetyBar score={driver.safetyScore ?? 100} />
                                        </td>
                                        {/* Complaints */}
                                        <td className="p-4 text-center">
                                            <span className={`font-semibold ${driver.complaints > 0 ? 'text-orange-400' : 'text-neutral-400'}`}>
                                                {driver.complaints ?? 0}
                                            </span>
                                        </td>
                                        {/* Duty Status */}
                                        <td className="p-4">
                                            {!isReadOnly ? (
                                                <div className="relative">
                                                    <select
                                                        value={driver.dutyStatus}
                                                        onChange={e => changeStatus(driver.id, e.target.value)}
                                                        className="appearance-none bg-neutral-950/80 border border-neutral-800 rounded-lg pl-3 pr-7 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                                    >
                                                        <option value="ON_DUTY">On Duty</option>
                                                        <option value="BREAK">Break</option>
                                                        <option value="SUSPENDED">Suspended</option>
                                                    </select>
                                                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                                </div>
                                            ) : (
                                                <DutyPill status={driver.dutyStatus} />
                                            )}
                                        </td>
                                        {/* Availability */}
                                        <td className="p-4">
                                            <AvailabilityPill status={driver.availability} />
                                        </td>
                                        {/* Actions */}
                                        <td className="p-4">
                                            <button
                                                onClick={() => setIncidentDriver(driver)}
                                                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <ScrollText size={13} />
                                                Incidents
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showCreate && (
                <CreateDriverModal token={token} onClose={() => setShowCreate(false)} onCreated={fetchDrivers} />
            )}
            {incidentDriver && (
                <IncidentModal
                    driver={incidentDriver}
                    token={token}
                    onClose={() => setIncidentDriver(null)}
                    onRefresh={fetchDrivers}
                />
            )}
        </div>
    );
}
