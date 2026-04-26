'use client';
import React from 'react';
import { Bell, Zap, Radio, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
export default function AlertsPage() {
    return (<div className="space-y-8 md:space-y-12 pb-10">
            <PageHeader badgeIcon={Radio} badgeText="Signal Hub" titleMain="Alert" titleAccent="Protocols" description="Calibrating system notifications. Define the frequency and urgency of administrative telemetry." actionIcon={Zap} actionLabel="Sync Protocols" onAction={() => console.log('Syncing protocols...')}/>

            <div className="mx-auto space-y-8 md:space-y-10 px-4 md:px-0">
                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-8 md:space-y-10 group/section">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
                            <Bell className="h-6 w-6 md:h-7 md:w-7"/>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Signal Vectors</h3>
                            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Notification distribution parameters</p>
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-muted/10 border-2 border-dashed border-primary/10 hover:border-primary/40 transition-all cursor-pointer group/item gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-card flex items-center justify-center border shadow-sm group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 transition-all duration-500 shrink-0">
                                    <AlertTriangle className="h-5 w-5 md:h-6 md:w-6"/>
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-black uppercase tracking-tight italic">Critical Overrides</p>
                                    <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Emergency administrative broadcasts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span className="h-2 w-2 rounded-full bg-primary"/>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
