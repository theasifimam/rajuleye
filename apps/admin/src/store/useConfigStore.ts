'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            isSidebarCollapsed: false,
            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
        }),
        {
            name: 'admin-config-storage',
        }
    )
);
