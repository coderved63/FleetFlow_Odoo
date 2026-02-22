'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            login(data.token, data.user);

<<<<<<< HEAD
=======
            const roleRedirects = {
                ADMIN:            '/dashboard/admin',
                SAFETY_OFFICER:   '/dashboard/safety',
                DISPATCHER:       '/dashboard/dispatch',
                FLEET_MANAGER:    '/dashboard/vehicles',
                FINANCIAL_ANALYST:'/dashboard/expense',
            };
            router.push(roleRedirects[data.user.role] ?? '/dashboard');
>>>>>>> ebe73cf122fbf8b6678744ed30bb2f2677c31cfa
            // Conditional Redirection based on Role
            if (data.user.role === 'ADMIN') {
                router.push('/dashboard/admin');
            } else if (data.user.role === 'FINANCIAL_ANALYST') {
                router.push('/dashboard/analytics');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4 font-sans">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent inline-block">
                        FleetFlow
                    </h1>
                    <p className="text-neutral-400 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@fleetflow.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3.5 rounded-xl transition-all mt-2 disabled:opacity-50 shadow-lg shadow-blue-900/20"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
