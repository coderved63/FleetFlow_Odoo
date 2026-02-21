'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AdminDashboard() {
    const { token, user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FLEET_MANAGER'
    });
    const [message, setMessage] = useState('');

    const ROLES = [
        'ADMIN',
        'FLEET_MANAGER',
        'DISPATCHER',
        'SAFETY_OFFICER',
        'FINANCIAL_ANALYST'
    ];

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        if (token && user?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [token, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('User created successfully!');
                setFormData({ name: '', email: '', password: '', role: 'FLEET_MANAGER' });
                fetchUsers();
            } else {
                setMessage(data.error || 'Failed to create user');
            }
        } catch (err) {
            setMessage('Network error');
        }
    };

    if (user?.role !== 'ADMIN') {
        return <div className="p-8 text-red-500">Access Restricted. Admins only.</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Control Panel</h1>
                <p className="text-neutral-400 mt-1">Manage system access and assign roles to your team members.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* User Creation Form */}
                <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-white mb-6">Create New User</h2>

                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">Full Name</label>
                            <input
                                type="text" required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">Email Address</label>
                            <input
                                type="email" required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">Temporary Password</label>
                            <input
                                type="password" required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">Assign Role</label>
                            <select
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-4"
                        >
                            Create Account
                        </button>
                    </form>
                </div>

                {/* Existing Users List */}
                <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-800">
                        <h2 className="text-lg font-semibold text-white">Registered Users</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 bg-neutral-950/50">
                                    <th className="p-4 pl-6 font-semibold">Name / Email</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20">
                                        <td className="p-4 pl-6">
                                            <div className="font-medium text-white">{u.name}</div>
                                            <div className="text-neutral-500 text-xs mt-0.5">{u.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase border ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    u.role === 'FLEET_MANAGER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-neutral-800 text-neutral-300 border-neutral-700'
                                                }`}>
                                                {u.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-neutral-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-neutral-500 font-medium">No users found. Loading...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
