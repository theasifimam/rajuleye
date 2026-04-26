'use client';
import React from 'react';
import { Shield, Lock, Smartphone, ShieldCheck, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/PageHeader';
export default function SecurityPage() {
    return (<div className="space-y-8 md:space-y-12 pb-10">
            <PageHeader badgeIcon={Shield} badgeText="Security Citadel" titleMain="Security" titleAccent="Fortress" description="Hardening the digital perimeter. Managed encrypted protocols and multi-factor authentication nodes." actionIcon={Key} actionLabel="Lockdown Parameters" onAction={() => console.log('Activating lockdown...')}/>

            <div className="mx-auto space-y-8 md:space-y-10 px-4 md:px-0">
                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-8 md:space-y-10 group/section">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
                            <Lock className="h-6 w-6 md:h-7 md:w-7"/>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Access Protocols</h3>
                            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Encryption & multi-node validation</p>
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-muted/10 border-2 border-dashed border-primary/10 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group/item gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-card flex items-center justify-center border shadow-sm group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 transition-all duration-500 shrink-0">
                                    <ShieldCheck className="h-5 w-5 md:h-6 md:w-6"/>
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-black uppercase tracking-tight italic">Biometric Vault</p>
                                    <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">High-fidelity validation active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-primary self-end sm:self-auto">
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Active</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-muted/10 border-2 border-dashed border-primary/10 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group/item gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-card flex items-center justify-center border shadow-sm group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 transition-all duration-500 shrink-0">
                                    <Smartphone className="h-5 w-5 md:h-6 md:w-6"/>
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-black uppercase tracking-tight italic">Administrative Terminals</p>
                                    <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Authorized hardware nodes</p>
                                </div>
                            </div>
                            <Button variant="outline" className="h-10 md:h-12 px-5 md:px-6 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all w-full sm:w-auto">Rotate Keys</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
