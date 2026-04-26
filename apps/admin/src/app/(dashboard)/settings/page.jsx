/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { User, Bell, Shield, Globe, CreditCard, Store, Save, Lock, Smartphone, CheckCircle2, ChevronRight, Zap, Cpu, Fingerprint, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
export default function SettingsPage() {
    return (<div className="space-y-8 md:space-y-12 pb-10">
            {/* Premium Hero Section */}
            <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 overflow-hidden group mx-4 md:mx-0">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 blur-[80px] md:blur-[100px] animate-pulse"/>
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">
                            <Cpu className="h-3 w-3"/> Core Configuration
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic leading-none">
                            Operational <br />
                            <span className="text-primary not-italic">DNA</span>
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] max-w-md leading-relaxed">
                            Configuring the architecture of excellence. Calibrating the global operational parameters for the Rajul Eye administrative suite.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">System Integrity</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-xl md:text-2xl font-black italic leading-none">Stable</h4>
                                <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
                                    <Fingerprint className="h-3 w-3"/> Validated
                                </div>
                            </div>
                        </div>
                        <Button variant="signature" size="xl" className="h-16 md:h-20 w-full sm:w-auto">
                            <div className="flex flex-col items-center gap-0.5 md:gap-1">
                                <Save className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:scale-125 transition-transform duration-500"/>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Commit Changes</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 px-4 md:px-0">
                {/* Advanced Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4 md:mb-6 pl-4">System Nodes</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
                        {[
            { label: 'Boutique Profile', icon: Store, active: true },
            { label: 'Administrative ID', icon: User, active: false },
            { label: 'Security Fortress', icon: Shield, active: false },
            { label: 'Alert Protocols', icon: Bell, active: false },
            { label: 'Payment Engines', icon: CreditCard, active: false },
            { label: 'Global Localization', icon: Globe, active: false },
        ].map((item, i) => (<button key={i} className={cn("flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden", item.active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 italic"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-primary/5")}>
                                {item.active && (<div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"/>)}
                                <item.icon className={cn("h-4 w-4 md:h-5 md:w-5 shrink-0 transition-transform duration-500", !item.active && "group-hover:translate-x-1")}/>
                                <span className="text-[9px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
                                {item.active && <ChevronRight className="h-4 w-4 ml-auto hidden md:block"/>}
                            </button>))}
                    </div>

                    <div className="mt-8 md:mt-12 p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <Radio className="h-3 w-3 md:h-4 md:w-4 text-primary animate-pulse"/>
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary italic">Live Sync</span>
                        </div>
                        <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                            All configuration changes are propagated across the global CDN nodes in real-time.
                        </p>
                    </div>
                </div>

                {/* Settings Content Area - High Fidelity Forms */}
                <div className="lg:col-span-3 space-y-8 md:space-y-10">
                    {/* Section: Boutique Profile */}
                    <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-8 md:space-y-10 group/section">
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
                                <Store className="h-6 w-6 md:h-7 md:w-7"/>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Signature Identity</h3>
                                <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Global boutique presence & branding</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-2 md:pt-4">
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Brand Nameplate</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/input:scale-x-100 transition-transform origin-left z-10"/>
                                    <Input defaultValue="Rajul Eye Signature" className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black italic tracking-tight text-base md:text-lg shadow-sm focus-visible:ring-0"/>
                                </div>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Universal Concierge Email</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/input:scale-x-100 transition-transform origin-left z-10"/>
                                    <Input defaultValue="concierge@rajuleye.com" className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black tracking-tight text-base md:text-lg shadow-sm focus-visible:ring-0"/>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2 md:space-y-3">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Visionary Mission</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/input:scale-x-100 transition-transform origin-left z-10"/>
                                    <textarea className="w-full h-32 md:h-40 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-muted/20 border-none font-black italic tracking-tight text-sm md:text-base shadow-sm focus:ring-0 outline-none resize-none leading-relaxed" defaultValue="Bespoke high-end eyewear and precision lens technology. Curating the world's most exclusive optical heritage with uncompromising craftsmanship."/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Administrative Credentialling */}
                    <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-8 md:space-y-10 group/section">
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
                                <Shield className="h-6 w-6 md:h-7 md:w-7"/>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Access Credentials</h3>
                                <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Authentication & encrypted protocols</p>
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-muted/10 border-2 border-dashed border-primary/10 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group/item gap-6">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-card flex items-center justify-center border shadow-sm group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 transition-all duration-500 shrink-0">
                                        <Lock className="h-5 w-5 md:h-6 md:w-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm md:text-base font-black uppercase tracking-tight italic">Multi-Factor Authentication</p>
                                        <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Biometric & hardware key validated</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-primary self-end sm:self-auto">
                                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 shadow-[0_0_10px_rgba(34,197,94,0.5)]"/>
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Secured</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-muted/10 border-2 border-dashed border-primary/10 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group/item gap-6">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-card flex items-center justify-center border shadow-sm group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 transition-all duration-500 shrink-0">
                                        <Smartphone className="h-5 w-5 md:h-6 md:w-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm md:text-base font-black uppercase tracking-tight italic">Provisioned Terminals</p>
                                        <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">3 encrypted administrative nodes</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="h-10 md:h-12 px-5 md:px-6 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all w-full sm:w-auto">Audit Nodes</Button>
                            </div>
                        </div>
                    </div>

                    {/* System Version Matrix */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 rounded-[3rem] bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl -mr-20 -mt-20"/>
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-xl bg-card border flex items-center justify-center">
                                <Zap className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80 leading-relaxed max-w-md italic">
                                    Admin Console v1.4.2 <span className="not-italic opacity-40 mx-2">|</span> Signature Platinum Edition
                                </p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Architecture optimized for extreme fidelity operations.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-primary animate-ping"/>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Engine Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
