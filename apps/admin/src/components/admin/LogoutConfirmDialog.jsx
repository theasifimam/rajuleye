'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertCircle } from "lucide-react";
export function LogoutConfirmDialog({ isOpen, onOpenChange, onConfirm }) {
    return (<Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-card/40 backdrop-blur-3xl shadow-2xl">
                {/* Background Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive/60"/>
                
                <div className="p-8 md:p-10">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-[1.25rem] bg-destructive/10 flex items-center justify-center shrink-0">
                                <AlertCircle className="h-7 w-7 text-destructive"/>
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tight uppercase leading-none mb-2">
                                    Terminate <span className="text-destructive not-italic">Session?</span>
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    Admin Clearance Revoked upon exit
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed mb-10">
                            You are about to terminate your administrative command status. 
                            Unauthorized access to secure modules will be blocked immediately.
                        </p>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted">
                                Stay in Command
                            </Button>
                            <Button onClick={onConfirm} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-destructive hover:bg-destructive/90 text-white shadow-xl shadow-destructive/20">
                                <LogOut className="mr-2 h-4 w-4"/> Terminate Now
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>);
}
