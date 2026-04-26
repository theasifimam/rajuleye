'use client';
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useSendNewsletterMutation } from '@/store/subscriberApi';
import { toast } from 'sonner';
export function BroadcastDialog({ isOpen, onOpenChange, activeCount }) {
    const [subject, setSubject] = useState('');
    const [templateType, setTemplateType] = useState('raw');
    const [rawMessage, setRawMessage] = useState('');
    const [templateData, setTemplateData] = useState({
        title: '',
        content: '',
        discountPercentage: '',
        promoCode: '',
        validUntil: '',
        collectionName: '',
        description: '',
        link: '',
        tipTitle: '',
        tipBody: '',
        eventName: '',
        date: '',
        location: '',
        details: ''
    });
    const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation();
    const updateData = (key, value) => setTemplateData(prev => ({ ...prev, [key]: value }));
    const getHtmlMessage = () => {
        switch (templateType) {
            case 'standard':
                return `<h2 style="color: #fff; margin-top: 0;">${templateData.title || 'Update'}</h2><p style="font-size: 14px; line-height: 1.6;">${templateData.content || ''}</p>`;
            case 'offer':
                return `<h2 style="color: #e2b96f; margin-top: 0; text-transform: uppercase;">Exclusive Access</h2><p style="font-size: 14px; line-height: 1.6;">As a member of the archive, you are receiving this limited time offer.</p><div style="background: #e2b96f; color: #000; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;"><div style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">${templateData.discountPercentage || '0'}% OFF</div><div style="font-size: 14px; text-transform: uppercase;">Use Code: <span style="font-weight: bold; font-family: monospace;">${templateData.promoCode || 'CODE'}</span></div></div><p style="font-size: 12px; color: #888; text-align: center;">Valid until ${templateData.validUntil || 'TBD'}</p>`;
            case 'collection':
                return `<h2 style="color: #fff; margin-top: 0;">New Arrival: ${templateData.collectionName || 'Collection'}</h2><p style="font-size: 14px; line-height: 1.6;">${templateData.description || ''}</p><div style="text-align: center; margin-top: 30px;"><a href="${templateData.link || '#'}" style="background: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; border-radius: 4px; font-size: 12px;">Explore Now</a></div>`;
            case 'care':
                return `<h2 style="color: #fff; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">Protocol: ${templateData.tipTitle || 'Care Guide'}</h2><div style="background: #1a1a1a; padding: 20px; border-left: 3px solid #e2b96f; margin: 20px 0; font-size: 14px; line-height: 1.6;">${templateData.tipBody || ''}</div>`;
            case 'event':
                return `<h2 style="color: #fff; margin-top: 0; text-align: center;">You're Invited: ${templateData.eventName || 'Event'}</h2><div style="background: #0a0a0a; border: 1px solid #333; padding: 20px; text-align: center; margin: 20px 0;"><p style="font-size: 16px; font-weight: bold; color: #e2b96f; margin-top: 0;">${templateData.date || 'Date'}</p><p style="font-size: 14px; margin-bottom: 0px;">${templateData.location || 'Location'}</p></div><p style="font-size: 14px; line-height: 1.6; text-align: center;">${templateData.details || ''}</p>`;
            default:
                return rawMessage;
        }
    };
    const handleSend = async () => {
        const finalMessage = getHtmlMessage();
        if (!subject.trim() || !finalMessage.trim()) {
            toast.error('Subject and message content are required.');
            return;
        }
        try {
            const result = await sendNewsletter({ subject, message: finalMessage }).unwrap();
            toast.success(result.message || 'Newsletter dispatched!');
            onOpenChange(false);
            setSubject('');
            setRawMessage('');
        }
        catch (error) {
            toast.error(error?.data?.message || 'Failed to send newsletter.');
        }
    };
    return (<Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-black italic uppercase tracking-wider text-xl flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Send className="h-4 w-4 text-primary"/>
                        </div>
                        Compose Offer
                    </DialogTitle>
                    <DialogDescription className="font-bold uppercase tracking-widest text-[10px] opacity-60">
                        This message will be sent to all {activeCount} active ambassadors.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Subject Narrative</label>
                        <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Exclusive Limited Drop Access" className="h-12 font-bold border-white/10 rounded-xl bg-muted/20 focus-visible:ring-primary/20"/>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Template Architecture</label>
                        <Select value={templateType} onValueChange={setTemplateType}>
                            <SelectTrigger className="w-full h-12 rounded-xl border-white/10 bg-muted/20">
                                <SelectValue placeholder="Select a template"/>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-primary/10">
                                <SelectItem value="raw">Custom HTML Blueprint</SelectItem>
                                <SelectItem value="standard">Standard Brief</SelectItem>
                                <SelectItem value="offer">Limited Drop / Exclusive Access</SelectItem>
                                <SelectItem value="collection">Collection Showcase</SelectItem>
                                <SelectItem value="care">Protocol / Maintenance Guide</SelectItem>
                                <SelectItem value="event">Signature Invitation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-px bg-primary/5 my-2"/>

                    {templateType === 'raw' && (<div className="space-y-2 animate-in fade-in duration-500">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">HTML Payload</label>
                            <Textarea value={rawMessage} onChange={(e) => setRawMessage(e.target.value)} placeholder="&lt;p&gt;Special offer code: EXOTIC15...&lt;/p&gt;" className="min-h-[250px] font-mono text-xs rounded-xl border-white/10 bg-muted/10 p-4"/>
                        </div>)}

                    {templateType === 'standard' && (<div className="space-y-5 bg-primary/[0.02] p-6 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Headline</label>
                                <Input value={templateData.title} onChange={(e) => updateData('title', e.target.value)} placeholder="e.g. Our Vision for 2026" className="rounded-xl h-11"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Brief Content</label>
                                <Textarea value={templateData.content} onChange={(e) => updateData('content', e.target.value)} placeholder="Main body text..." className="min-h-[120px] rounded-xl"/>
                            </div>
                        </div>)}

                    {templateType === 'offer' && (<div className="space-y-5 bg-primary/[0.02] p-6 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Yield (%)</label>
                                    <Input type="number" value={templateData.discountPercentage} onChange={(e) => updateData('discountPercentage', e.target.value)} placeholder="e.g. 15" className="rounded-xl h-11"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Signature Code</label>
                                    <Input value={templateData.promoCode} onChange={(e) => updateData('promoCode', e.target.value)} placeholder="e.g. EXOTIC15" className="rounded-xl h-11"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Validity Horizon</label>
                                <Input value={templateData.validUntil} onChange={(e) => updateData('validUntil', e.target.value)} placeholder="e.g. March 10, Midnight CET" className="rounded-xl h-11"/>
                            </div>
                        </div>)}

                    {templateType === 'collection' && (<div className="space-y-5 bg-primary/[0.02] p-6 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Collection Identity</label>
                                <Input value={templateData.collectionName} onChange={(e) => updateData('collectionName', e.target.value)} placeholder="e.g. Carbon Drop II" className="rounded-xl h-11"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Lore / Description</label>
                                <Textarea value={templateData.description} onChange={(e) => updateData('description', e.target.value)} placeholder="Brief narrative..." className="min-h-[100px] rounded-xl"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Navigation Link</label>
                                <Input value={templateData.link} onChange={(e) => updateData('link', e.target.value)} placeholder="e.g. /collections/carbon-ii" className="rounded-xl h-11"/>
                            </div>
                        </div>)}

                    {templateType === 'care' && (<div className="space-y-5 bg-primary/[0.02] p-6 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Protocol Title</label>
                                <Input value={templateData.tipTitle} onChange={(e) => updateData('tipTitle', e.target.value)} placeholder="e.g. Titanium Calibration" className="rounded-xl h-11"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Procedure Details</label>
                                <Textarea value={templateData.tipBody} onChange={(e) => updateData('tipBody', e.target.value)} placeholder="Use microfiber only..." className="min-h-[150px] rounded-xl"/>
                            </div>
                        </div>)}

                    {templateType === 'event' && (<div className="space-y-5 bg-primary/[0.02] p-6 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Event Designation</label>
                                <Input value={templateData.eventName} onChange={(e) => updateData('eventName', e.target.value)} placeholder="e.g. Store Launch Gala" className="rounded-xl h-11"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Chronology</label>
                                    <Input value={templateData.date} onChange={(e) => updateData('date', e.target.value)} placeholder="e.g. Friday, 8PM" className="rounded-xl h-11"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Coordinates</label>
                                    <Input value={templateData.location} onChange={(e) => updateData('location', e.target.value)} placeholder="e.g. Neo-Delhi Hub" className="rounded-xl h-11"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Sequence Details</label>
                                <Textarea value={templateData.details} onChange={(e) => updateData('details', e.target.value)} placeholder="Join us for..." className="min-h-[100px] rounded-xl"/>
                            </div>
                        </div>)}

                </div>
                <DialogFooter className="border-t border-primary/5 pt-8 pb-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSending} className="rounded-xl px-8 h-12 text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all">
                        Suspend
                    </Button>
                    <Button onClick={handleSend} disabled={isSending || !subject} className="bg-primary text-primary-foreground rounded-xl px-10 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        {isSending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : (<Send className="mr-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>)}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dispatch Broadcast</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}
