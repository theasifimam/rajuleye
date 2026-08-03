'use client';
import { useAppSelector } from '@/store/store';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }) {
    const [mounted, setMounted] = useState(false);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user && user.role !== 'admin' && user.role !== 'moderator') {
                router.push('/login');
            }
        }
    }, [mounted, isAuthenticated, user, router]);

    if (!mounted || !isAuthenticated || (user && user.role !== 'admin' && user.role !== 'moderator')) {
        return null;
    }

    return <>{children}</>;
}

