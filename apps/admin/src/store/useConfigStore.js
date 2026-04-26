'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useConfigStore = create()(persist((set) => ({
    isSidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}), {
    name: 'admin-config-storage',
}));
