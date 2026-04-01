'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
    id: number;
    type: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isPrimary?: boolean;
}

interface AddressState {
    addresses: Address[];
    addAddress: (address: Omit<Address, 'id' | 'isPrimary'>) => void;
    removeAddress: (id: number) => void;
    setPrimary: (id: number) => void;
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set) => ({
            addresses: [
                {
                    id: 1,
                    type: 'Home',
                    street: '123 Luxury Suites',
                    apartment: 'Silicon Valley',
                    city: 'San Jose',
                    state: 'CA',
                    zip: '94025',
                    country: 'United States',
                    isPrimary: true
                },
                {
                    id: 2,
                    type: 'Office',
                    street: 'Tech Park Tower B',
                    apartment: 'Floor 12',
                    city: 'San Francisco',
                    state: 'CA',
                    zip: '94103',
                    country: 'United States',
                    isPrimary: false
                },
            ],
            addAddress: (address) => set((state) => {
                const newAddress = {
                    ...address,
                    id: Date.now(),
                    isPrimary: state.addresses.length === 0
                };
                return { addresses: [...state.addresses, newAddress] };
            }),
            removeAddress: (id) => set((state) => ({
                addresses: state.addresses.filter(a => a.id !== id)
            })),
            setPrimary: (id) => set((state) => ({
                addresses: state.addresses.map(a => ({
                    ...a,
                    isPrimary: a.id === id
                }))
            })),
        }),
        {
            name: 'address-storage',
        }
    )
);
