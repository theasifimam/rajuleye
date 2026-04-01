'use client';

import { ArrowRight, Eye, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-24 py-24">
            {/* Mission Section */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                            Established 1998
                        </div>
                        <h1 className="text-4xl md:text-7xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.9] lg:leading-[0.85]">
                            Architecting <br /> <span className="text-muted-foreground/30">Human</span> Vision
                        </h1>
                        <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-xl leading-relaxed">
                            At Rajul Eye, we believe that optic design is not just about correction—it's about the architectural enhancement of the human perspective.
                        </p>
                    </div>
                    <div className="aspect-[4/5] lg:aspect-square xl:aspect-[4/5] relative rounded-[3rem] overflow-hidden bg-muted animate-in fade-in slide-in-from-right duration-1000 shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1641048927024-0e801784b4f7?q=80&w=1000&auto=format&fit=crop"
                            alt="Precision Eyewear Architecture"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-muted/30 py-32">
                <div className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                    <div className="flex flex-col mb-20 items-center text-center space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">The Signature Blueprint</h2>
                        <p className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">Scientific Precision Meets Handcrafted Artistry</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Sparkles,
                                title: "Adaptive Tech",
                                desc: "Our lenses utilize neuro-adaptive technology that shifts focus faster than the human blink."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Heritage Craft",
                                desc: "Every frame is hand-carved in our Delhi atelier from sustainably sourced carbon-acetates."
                            },
                            {
                                icon: Zap,
                                title: "Hyper-Focus",
                                desc: "Engineered to increase visual clarity by 18% in high-glare architectural environments."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-12 bg-background rounded-[2.5rem] border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="bg-primary p-12 md:p-24 rounded-[3.5rem] text-center space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                    <h2 className="text-4xl md:text-7xl font-black text-primary-foreground uppercase tracking-tighter relative z-10">
                        See The Future <br /> Through Our Lens
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        <button className="h-16 px-12 rounded-full bg-primary-foreground text-primary font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                            Visit Our Atelier
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
