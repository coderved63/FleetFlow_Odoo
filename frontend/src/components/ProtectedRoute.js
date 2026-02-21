'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Give Zustand a moment to rehydrate from localStorage
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
                // Redirect if they lack specific role privileges
                router.push('/dashboard');
            }
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, router, allowedRoles]);

    if (isChecking) return null; // Wait for state to settle

    if (!isAuthenticated) return null;

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
