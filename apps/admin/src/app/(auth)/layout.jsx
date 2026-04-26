'use client';
import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
export default function AuthLayout({ children, }) {
    return (<div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Hero Branding (md+ only) */}
      <div className="hidden md:flex relative w-1/2 lg:w-[60%] bg-[#050505] p-12 lg:p-20 flex-col justify-between overflow-hidden group">
        {/* Visual Backdrop */}
        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 grayscale group-hover:grayscale-0">
          <Image src="/auth_visual.png" alt="Rajul Eye Signature" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"/>
        </div>

        {/* Top Branding */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6 text-primary-foreground"/>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-white">
              Rajul<span className="text-primary italic">Eye</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-1">Signature Suite</p>
          </div>
        </motion.div>

        {/* Bottom Branding Content */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-md">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <Sparkles className="h-5 w-5"/>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Excellence</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-6 italic leading-none">
              The Architecture <br />
              <span className="text-primary not-italic">Of Vision</span>
            </h2>
            <p className="text-sm font-medium text-white/50 leading-relaxed uppercase tracking-wider">
              Bespoke administrative control systems for the world&apos;s most exclusive optical heritage. Calibrating precision, security, and elegance.
            </p>
          </motion.div>

          {/* Stats/Badge */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="mt-12 inline-flex items-center gap-4 py-3 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (<div key={i} className="h-8 w-8 rounded-full border-2 border-[#050505] bg-muted/20"/>))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
              Trusted by Global Artisans
            </p>
          </motion.div>
        </div>

        {/* Background Glow */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px] animate-pulse pointer-events-none"/>
      </div>

      {/* Right Section - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-background">
        {/* Background Elements for Mobile */}
        <div className="md:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px] -mr-[40%] -mt-[40%]"/>
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          {/* Form Header (Mobile only) */}
          <div className="md:hidden flex flex-col items-center mb-10">
            <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary-foreground"/>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
              Rajul<span className="text-primary italic">Eye</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mt-2">Command Center</p>
          </div>

          {/* Content Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card/20 md:bg-transparent backdrop-blur-3xl md:backdrop-blur-0 border border-white/10 md:border-none p-8 md:p-0 rounded-[2.5rem] md:rounded-none">
            {children}
          </motion.div>

          {/* Footer Links */}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-12 md:mt-16">
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">
              Support
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/20"/>
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">
              Privacy
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/20"/>
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>

        {/* Bottom Signature */}
        <div className="absolute bottom-8 text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic">
          Precision Craftsmanship Since 1994
        </div>
      </div>
    </div>);
}
