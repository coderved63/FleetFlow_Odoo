'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
            // Redirect to their specific dashboard if not allowed
            router.push('/dashboard');
        }
    }, [isAuthenticated, user, router, allowedRoles]);

    if (!isAuthenticated) return null; // or a loading spinner

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) return null;

    return <>{children}</>;
}
