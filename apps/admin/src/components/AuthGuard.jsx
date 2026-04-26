'use client';
import { useAppSelector } from '@/store/store';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export function AuthGuard({ children }) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const router = useRouter();
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
        else if (user && user.role !== 'admin' && user.role !== 'moderator') {
            // Should not happen if login logic is correct, but good for safety
            router.push('/login');
        }
    }, [isAuthenticated, user, router]);
    if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'moderator')) {
        return null;
    }
    return <>{children}</>;
}
