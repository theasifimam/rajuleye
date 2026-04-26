'use client';
import { Shield, Scale, Eye, ScrollText } from 'lucide-react';
export default function TermsPage() {
    return (<div className="flex flex-col gap-24 py-24">
            {/* Header */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left duration-700">
                    <h1 className="text-4xl xs:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                        Legal <br /> <span className="text-muted-foreground/30">Governance</span>
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed max-w-2xl">
                        The architectural framework governing your interaction with Rajul Eye Signature Optics. Last updated January 2026.
                    </p>
                </div>
            </section>

            {/* Content Table */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="sticky top-32 space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Table of Protocols</h4>
                            <nav className="flex flex-col gap-6">
                                {['Condition of Sale', 'Privacy Directive', 'Optic Warranty', 'Digital Conduct'].map((item) => (<button key={item} className="text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-tight text-left">
                                        {item}
                                    </button>))}
                            </nav>
                        </div>
                    </div>

                    {/* Legal Text */}
                    <div className="lg:col-span-9 space-y-32">
                        {[
            {
                icon: Scale,
                title: "01. Condition of Sale",
                content: "By commissioning a pair of Rajul Eye signature optics, you acknowledge that bespoke lens technology requires technical precision. Orders once processed through our Mumbai digital atelier undergo biomechanical calibration and cannot be modified after 2 hours."
            },
            {
                icon: Shield,
                title: "02. Privacy Directive",
                content: "Your vision data—including prescription metrics and biometric facial mapping—is stored within an ultra-secure architectural database. We operate on a 'Zero-Visibility' protocol, ensuring your visual identifiers never reach third-party aggregators."
            },
            {
                icon: Eye,
                title: "03. Optic Warranty",
                content: "We provide a structural lifetime guarantee on all carbon-acetate and titanium frames. Lens coatings including anti-refractive and neuro-adaptive layers are covered for 24 months of architectural use."
            },
            {
                icon: ScrollText,
                title: "04. Digital Conduct",
                content: "The Rajul Eye digital ecosystem is a space for refined visual exploration. Any attempt to scrape our proprietary lens algorithms or frame silhouettes will result in immediate termination of membership."
            }
        ].map((section, idx) => (<div key={idx} className="space-y-12 max-w-3xl group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0">
                                        <section.icon className="h-5 w-5 md:h-7 md:h-7"/>
                                    </div>
                                    <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter">{section.title}</h2>
                                </div>
                                <div className="pl-0 md:pl-22 space-y-6">
                                    <p className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </p>
                                    <p className="text-sm text-muted-foreground/60 leading-relaxed italic">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>))}
                    </div>
                </div>
            </section>
        </div>);
}
