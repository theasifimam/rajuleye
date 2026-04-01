'use client';

import { Search, MessageCircle, Truck, RefreshCcw, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HelpPage() {
    return (
        <div className="flex flex-col gap-24 py-24">
            {/* Search Section */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px] text-center">
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl xs:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                        Concierge <br /> <span className="text-muted-foreground/30">& Utility</span>
                    </h1>
                    <p className="text-base xs:text-lg md:text-xl font-medium text-muted-foreground leading-relaxed px-4">
                        Navigate the Rajul Eye ecosystem with precision. How can our experts assist your vision today?
                    </p>
                    <div className="relative group max-w-2xl mx-auto pt-8">
                        <Search className="absolute left-6 top-1/2 mt-4 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search your technical requirements..."
                            className="h-20 pl-16 pr-8 rounded-full bg-muted/40 border-none focus:ring-4 focus:ring-primary/10 text-lg font-bold placeholder:font-medium placeholder:text-muted-foreground/40"
                        />
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { icon: Truck, title: "Tracking", desc: "Monitor transit" },
                        { icon: RefreshCcw, title: "Returns", desc: "Our guarantee" },
                        { icon: ShieldCheck, title: "Warranty", desc: "Structural integrity" },
                        { icon: MessageCircle, title: "Consult", desc: "Lens technologist" }
                    ].map((item, i) => (
                        <div key={i} className="p-6 xs:p-8 md:p-10 bg-card rounded-[2rem] md:rounded-[2.5rem] border border-border/50 hover:bg-primary/5 transition-all duration-500 cursor-pointer group text-center flex flex-col items-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <item.icon className="h-5 w-5 md:h-7 md:h-7" />
                            </div>
                            <h3 className="text-xs xs:text-sm md:text-xl font-black uppercase tracking-tight mb-1 md:mb-2">{item.title}</h3>
                            <p className="text-[10px] md:text-sm text-muted-foreground font-medium leading-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Grid */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 bg-muted/20 p-8 xs:p-12 md:p-24 rounded-[2.5rem] md:rounded-[3.5rem] border border-border/20">
                    <div className="space-y-4 md:space-y-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-primary-foreground">
                            <Phone className="h-5 w-5 md:h-6 md:h-6" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight">Direct Path</h4>
                        <p className="text-lg md:text-xl font-bold text-muted-foreground">+91 (800) 293-2930</p>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/60 uppercase tracking-widest leading-loose">Available Monday — Saturday <br /> 09:00 — 21:00 IST</p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-primary-foreground">
                            <Mail className="h-5 w-5 md:h-6 md:h-6" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight">Digital Dispatch</h4>
                        <p className="text-lg md:text-xl font-bold text-muted-foreground">concierge@rajuleye.com</p>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/60 uppercase tracking-widest leading-loose">Typical response time <br /> under 120 minutes</p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-primary-foreground">
                            <MapPin className="h-5 w-5 md:h-6 md:h-6" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight">Global Atelier</h4>
                        <p className="text-lg md:text-xl font-bold text-muted-foreground">1028 Signature Tower, New Delhi</p>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/60 uppercase tracking-widest leading-loose">Schedule a physical <br /> biomechanical consult</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
