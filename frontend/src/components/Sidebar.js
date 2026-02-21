'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Truck,
    MapPin,
    Wrench,
    DollarSign,
    BarChart2,
    LogOut,
    Users,
    Activity
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push(
            { name: 'Vehicle Registry', icon: <Truck size={20} />, href: '/dashboard/vehicles' },
            { name: 'Trip Dispatcher', icon: <MapPin size={20} />, href: '/dashboard/dispatch' },
            { name: 'Maintenance', icon: <Wrench size={20} />, href: '/dashboard/maintenance' },
            { name: 'Trip & Expense', icon: <DollarSign size={20} />, href: '/dashboard/expense' },
            { name: 'Performance', icon: <BarChart2 size={20} />, href: '/dashboard/performance' },
            { name: 'Analytics', icon: <Activity size={20} />, href: '/dashboard/analytics' },
            { name: 'User Management', icon: <Users size={20} />, href: '/dashboard/admin' }
        );
    } else if (user?.role === 'FLEET_MANAGER') {
        // Fleet Manager oversees vehicles and maintenance (Fleet Health & Assets) strictly
        navItems.push(
            { name: 'Vehicle Registry', icon: <Truck size={20} />, href: '/dashboard/vehicles' },
            { name: 'Maintenance', icon: <Wrench size={20} />, href: '/dashboard/maintenance' }
        );
    } else if (user?.role === 'DISPATCHER') {
        // Dispatcher focuses on Trip Dispatching strictly
        navItems.push(
            { name: 'Trip Dispatcher', icon: <MapPin size={20} />, href: '/dashboard/dispatch' }
        );
    }

    return (
        <div className="w-64 bg-neutral-900 border-r border-neutral-800 text-white flex flex-col h-screen">
            <div className="p-6 border-b border-neutral-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    FleetFlow
                </h1>
                {user?.role && (
                    <p className="text-xs text-neutral-400 mt-1 capitalize">Role: {user.role.replace('_', ' ')}</p>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-800">
                {user && (
                    <div className="px-4 py-3 mb-2 text-sm text-neutral-400 truncate">
                        {user.email}
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
