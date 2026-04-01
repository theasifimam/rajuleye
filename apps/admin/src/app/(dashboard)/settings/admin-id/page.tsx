'use client';

import React from 'react';
import { User, Save, Fingerprint } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/admin/PageHeader';

export default function AdminIdPage() {
    return (
        <div className="space-y-8 md:space-y-12 pb-10">
            <PageHeader
                badgeIcon={User}
                badgeText="Administrative Node"
                titleMain="Administrative"
                titleAccent="Identity"
                description="Personalize your administrative access node. Calibration of your digital presence within the Rajul Eye matrix."
                actionIcon={Save}
                actionLabel="Commit Identity"
                onAction={() => console.log('Committing identity...')}
            />

            <div className="mx-auto space-y-8 md:space-y-10 px-4 md:px-0">
                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-8 md:space-y-10 group/section">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
                            <Fingerprint className="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Commander Credentials</h3>
                            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Personal access parameters</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-2 md:pt-4">
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Callsign (Name)</label>
                            <Input defaultValue="Admin Commander" className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black italic tracking-tight text-base md:text-lg shadow-sm" />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Secure Vector (Email)</label>
                            <Input defaultValue="admin@rajuleye.com" className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black tracking-tight text-base md:text-lg shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
