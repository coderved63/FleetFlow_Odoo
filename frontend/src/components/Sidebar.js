'use client';
import { useState } from 'react';
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
    Activity,
    ShieldAlert,
    Menu,
    X
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const navItems = [];

    // Dashboard link for all roles except SAFETY_OFFICER and FINANCIAL_ANALYST
    if (user?.role !== 'SAFETY_OFFICER' && user?.role !== 'FINANCIAL_ANALYST') {
        navItems.push({ name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' });
    }

    if (user?.role === 'ADMIN') {
        navItems.push(
            { name: 'Vehicle Registry', icon: <Truck size={20} />, href: '/dashboard/vehicles' },
            { name: 'Trip Dispatcher', icon: <MapPin size={20} />, href: '/dashboard/dispatch' },
            { name: 'Maintenance', icon: <Wrench size={20} />, href: '/dashboard/maintenance' },
            { name: 'Safety & Compliance', icon: <ShieldAlert size={20} />, href: '/dashboard/safety' },
            { name: 'Trip & Expense', icon: <DollarSign size={20} />, href: '/dashboard/expense' },
            { name: 'Performance', icon: <BarChart2 size={20} />, href: '/dashboard/performance' },
            { name: 'Analytics', icon: <Activity size={20} />, href: '/dashboard/analytics' },
            { name: 'User Management', icon: <Users size={20} />, href: '/dashboard/admin' }
        );
    } else if (user?.role === 'FLEET_MANAGER') {
        navItems.push(
            { name: 'Vehicle Registry', icon: <Truck size={20} />, href: '/dashboard/vehicles' },
            { name: 'Maintenance', icon: <Wrench size={20} />, href: '/dashboard/maintenance' },
            { name: 'Safety & Compliance', icon: <ShieldAlert size={20} />, href: '/dashboard/safety' }
        );
    } else if (user?.role === 'DISPATCHER') {
        navItems.push(
            { name: 'Trip Dispatcher', icon: <MapPin size={20} />, href: '/dashboard/dispatch' }
        );
    } else if (user?.role === 'SAFETY_OFFICER') {
        navItems.push(
            { name: 'Safety & Compliance', icon: <ShieldAlert size={20} />, href: '/dashboard/safety' }
        );
    } else if (user?.role === 'FINANCIAL_ANALYST') {
        navItems.push(
            { name: 'Trip & Expense', icon: <DollarSign size={20} />, href: '/dashboard/expense' },
            { name: 'Analytics', icon: <Activity size={20} />, href: '/dashboard/analytics' }
        );
    }

    const sidebarContent = (
        <div className="w-64 bg-neutral-900 border-r border-neutral-800 text-white flex flex-col h-full">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        FleetFlow
                    </h1>
                    {user?.role && (
                        <p className="text-xs text-neutral-400 mt-1 capitalize">Role: {user.role.replace(/_/g, ' ')}</p>
                    )}
                </div>
                {/* Close button — only visible on mobile */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
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

    return (
        <>
            {/* ── Mobile hamburger button ── */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors shadow-lg"
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {/* ── Mobile: backdrop + slide-in drawer ── */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div
                className={`md:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {sidebarContent}
            </div>

            {/* ── Desktop: always-visible sidebar ── */}
            <div className="hidden md:flex h-screen flex-shrink-0">
                {sidebarContent}
            </div>
        </>
    );
}
