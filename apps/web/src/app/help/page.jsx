'use client';
import { useState } from 'react';
import { Search, MessageCircle, Truck, RefreshCcw, ShieldCheck, Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HelpPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) {
            setErrorMsg('Please fill in all fields.');
            return;
        }
        setStatus('loading');
        setErrorMsg('');
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${baseUrl}/api/v1/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed to send message');
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex flex-col gap-24 py-24">
            {/* Search Section */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px] text-center">
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl xs:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                        Concierge <br /> <span className="text-muted-foreground/30">&amp; Utility</span>
                    </h1>
                    <p className="text-base xs:text-lg md:text-xl font-medium text-muted-foreground leading-relaxed px-4">
                        Navigate the Rajul Eye ecosystem with precision. How can our experts assist your vision today?
                    </p>
                    <div className="relative group max-w-2xl mx-auto pt-8">
                        <Search className="absolute left-6 top-1/2 mt-4 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="Search your technical requirements..." className="h-20 pl-16 pr-8 rounded-full bg-muted/40 border-none focus:ring-4 focus:ring-primary/10 text-lg font-bold placeholder:font-medium placeholder:text-muted-foreground/40" />
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
                                <item.icon className="h-5 w-5 md:h-7 md:w-7" />
                            </div>
                            <h3 className="text-xs xs:text-sm md:text-xl font-black uppercase tracking-tight mb-1 md:mb-2">{item.title}</h3>
                            <p className="text-[10px] md:text-sm text-muted-foreground font-medium leading-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
                    {/* Form */}
                    <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-[2.5rem] md:rounded-[3.5rem] p-8 xs:p-10 md:p-14">
                        <div className="mb-10">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-3">
                                Send a <span className="text-primary italic">Message</span>
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                                We'll respond within 120 minutes
                            </p>
                        </div>

                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
                                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-2">Message Sent!</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Our team will reach out shortly.</p>
                                </div>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Your Name
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full h-12 md:h-14 bg-muted/40 rounded-2xl px-5 text-sm font-bold border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 placeholder:font-medium transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Email Address
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full h-12 md:h-14 bg-muted/40 rounded-2xl px-5 text-sm font-bold border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 placeholder:font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        Subject
                                    </label>
                                    <input
                                        id="contact-subject"
                                        name="subject"
                                        type="text"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        className="w-full h-12 md:h-14 bg-muted/40 rounded-2xl px-5 text-sm font-bold border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 placeholder:font-medium transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Describe your inquiry in detail..."
                                        className="w-full bg-muted/40 rounded-2xl px-5 py-4 text-sm font-bold border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 placeholder:font-medium transition-all resize-none"
                                    />
                                </div>

                                {errorMsg && (
                                    <p className="text-[11px] font-bold text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                                        {errorMsg}
                                    </p>
                                )}

                                <button
                                    id="contact-submit-btn"
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full h-14 md:h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-8 lg:pt-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-3">
                                Other <span className="text-muted-foreground/30">Ways</span>
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                                Reach us directly
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: Phone,
                                    title: "Direct Path",
                                    detail: "+91 (800) 293-2930",
                                    sub: "Available Monday — Saturday\n09:00 — 21:00 IST",
                                },
                                {
                                    icon: Mail,
                                    title: "Digital Dispatch",
                                    detail: "concierge@rajuleye.com",
                                    sub: "Typical response time\nunder 120 minutes",
                                },
                                {
                                    icon: MapPin,
                                    title: "Global Atelier",
                                    detail: "1028 Signature Tower, New Delhi",
                                    sub: "Schedule a physical\nbiomechanical consult",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-5 p-6 rounded-[2rem] bg-card/40 border border-border/30 hover:border-primary/20 hover:bg-primary/3 transition-all duration-500 group"
                                >
                                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shrink-0 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-base font-bold text-muted-foreground mb-1">{item.detail}</p>
                                        <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest leading-loose whitespace-pre-line">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
