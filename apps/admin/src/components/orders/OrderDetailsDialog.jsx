import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useUpdateOrderStatusMutation } from '@/store/orderApi';
import { CheckCircle2, Clock, Truck, XCircle, Box, AlertCircle, Loader2, Eye, Edit3, FileImage, MessageCircle, SkipForward, CreditCard, Shield, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ORDER_STATUSES = [
    { value: 'placed', label: 'Placed', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { value: 'processing', label: 'Processing', icon: Box },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
    { value: 'returned', label: 'Returned', icon: AlertCircle },
];

const POWER_METHOD_INFO = {
    saved: { label: 'Used Saved Power', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-800' },
    manual: { label: 'Entered Manually', icon: Edit3, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800' },
    upload: { label: 'Uploaded Prescription', icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800' },
    whatsapp: { label: 'Will Share on WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200 dark:border-green-800' },
    skip: { label: 'Skipped – Power Pending', icon: SkipForward, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800' },
};

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
}

export function OrderDetailsDialog({ order, open, onOpenChange }) {
    const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
    const [selectedStatus, setSelectedStatus] = useState('');
    React.useEffect(() => {
        if (order) {
            setSelectedStatus(order.orderStatus);
        }
    }, [order]);
    if (!order)
        return null;
    const handleStatusUpdate = async () => {
        if (!selectedStatus || selectedStatus === order.orderStatus)
            return;
        try {
            await updateStatus({ id: order._id, status: selectedStatus }).unwrap();
            toast.success('Order status updated successfully');
        }
        catch (err) {
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    const hasRazorpayInfo = order.razorpayOrderId || order.razorpayPaymentId;

    return (<Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] bg-background/95 backdrop-blur-xl border-primary/20">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        Order #{order._id.slice(-8)}
                    </DialogTitle>
                    <DialogDescription>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </DialogDescription>
                </DialogHeader>
                <div className="h-[550px] max-h-[75vh] pr-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Customer & Shipping Info */}
                        <div className="space-y-4">
                            <div className="bg-muted/10 p-4 rounded-2xl border border-primary/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Customer Details</h4>
                                <p className="font-bold text-sm">{order.user?.name}</p>
                                <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                                <p className="text-xs text-muted-foreground mt-1">Mobile: {order.shippingAddress?.mobile || 'N/A'}</p>
                            </div>

                            <div className="bg-muted/10 p-4 rounded-2xl border border-primary/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Shipping Address</h4>
                                <p className="text-sm font-medium">{order.shippingAddress?.fullName}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {order.shippingAddress?.line1} {order.shippingAddress?.line2}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                                </p>
                                <p className="text-xs text-muted-foreground">{order.shippingAddress?.country}</p>
                            </div>
                        </div>

                        {/* Order Status Control */}
                        <div className="space-y-4">
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Update Order Status</h4>
                                <div className="flex flex-col gap-3">
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="w-full bg-background border-primary/20">
                                            <SelectValue placeholder="Select Status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ORDER_STATUSES.map((status) => (<SelectItem key={status.value} value={status.value}>
                                                    <div className="flex items-center gap-2">
                                                        <status.icon className="w-4 h-4"/>
                                                        <span className="uppercase tracking-wider text-xs font-bold">{status.label}</span>
                                                    </div>
                                                </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleStatusUpdate} disabled={isLoading || selectedStatus === order.orderStatus} className="w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                                        Save Status
                                    </Button>
                                </div>
                            </div>

                            {/* Payment Status Summary */}
                            <div className="bg-muted/10 p-4 rounded-2xl border border-primary/5 flex items-center justify-between">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment</h4>
                                    <p className="text-xs font-bold uppercase mt-1">{order.paymentMethod}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Paid</h4>
                                    <p className="text-lg font-black italic text-primary">₹{order.finalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</h4>
                                    <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-500' : order.paymentStatus === 'failed' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                        {order.paymentStatus}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Razorpay Payment Details (for admin manual verification) */}
                    {hasRazorpayInfo && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">Razorpay Payment Verification</h4>
                            </div>
                            <div className="space-y-3">
                                {order.razorpayOrderId && (
                                    <div className="flex items-center justify-between gap-2 bg-white/60 dark:bg-background/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Razorpay Order ID</p>
                                            <p className="text-xs font-mono font-bold mt-0.5 break-all">{order.razorpayOrderId}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(order.razorpayOrderId)}>
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                                {order.razorpayPaymentId && (
                                    <div className="flex items-center justify-between gap-2 bg-white/60 dark:bg-background/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Razorpay Payment ID</p>
                                            <p className="text-xs font-mono font-bold mt-0.5 break-all">{order.razorpayPaymentId}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(order.razorpayPaymentId)}>
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                                {order.razorpaySignature && (
                                    <div className="flex items-center justify-between gap-2 bg-white/60 dark:bg-background/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment Signature</p>
                                            <p className="text-[10px] font-mono mt-0.5 truncate">{order.razorpaySignature}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(order.razorpaySignature)}>
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                                {order.paidAt && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                            Paid on {new Date(order.paidAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                )}
                                <a
                                    href={`https://dashboard.razorpay.com/app/payments/${order.razorpayPaymentId || ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 mt-2"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Verify on Razorpay Dashboard
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="bg-muted/10 rounded-2xl border border-primary/5 overflow-hidden">
                        <div className="p-4 border-b border-primary/5 bg-muted/20">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Items List</h4>
                        </div>
                        <div className="p-4 space-y-4">
                            {order.items.map((item, idx) => {
                                const powerMethod = item.powerSubmissionMethod ? POWER_METHOD_INFO[item.powerSubmissionMethod] : null;
                                const PowerMethodIcon = powerMethod?.icon;
                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex items-center gap-4 bg-background p-3 rounded-xl border border-primary/5">
                                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                                {item.image ? (<img src={item.image} alt={item.name} className="w-full h-full object-cover"/>) : (<Box className="w-6 h-6 text-muted-foreground opacity-50"/>)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Qty: {item.qty} • ₹{item.price}
                                                    {item.lensType && ` • ${item.lensType}`}
                                                    {item.frameName && item.frameName !== 'Plane Glass' && ` • Frame: ${item.frameName}`}
                                                    {item.isPlaneGlass && ' • Plane Glass'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black italic">₹{(item.qty * item.price).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Power/Prescription Info for this item */}
                                        {powerMethod && (
                                            <div className={cn("ml-4 p-3 rounded-xl border", powerMethod.bg, powerMethod.border)}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {PowerMethodIcon && <PowerMethodIcon className={cn("h-4 w-4", powerMethod.color)} />}
                                                    <span className={cn("text-xs font-black uppercase tracking-wider", powerMethod.color)}>
                                                        {powerMethod.label}
                                                    </span>
                                                </div>

                                                {/* Show power values for saved/manual */}
                                                {item.selectedPower && (item.powerSubmissionMethod === 'manual' || item.powerSubmissionMethod === 'saved') && (
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div className="bg-white/60 dark:bg-background/40 p-2 rounded-lg">
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 mb-1">Left Eye (OS)</p>
                                                            <div className="text-[10px] font-mono space-y-0.5">
                                                                <p>SPH: {item.selectedPower.left?.sphere || '—'}</p>
                                                                <p>CYL: {item.selectedPower.left?.cylinder || '—'}</p>
                                                                <p>AXIS: {item.selectedPower.left?.axis || '—'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/60 dark:bg-background/40 p-2 rounded-lg">
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-violet-600 mb-1">Right Eye (OD)</p>
                                                            <div className="text-[10px] font-mono space-y-0.5">
                                                                <p>SPH: {item.selectedPower.right?.sphere || '—'}</p>
                                                                <p>CYL: {item.selectedPower.right?.cylinder || '—'}</p>
                                                                <p>AXIS: {item.selectedPower.right?.axis || '—'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show prescription image for uploaded */}
                                                {item.selectedPower?.prescriptionImage && item.powerSubmissionMethod === 'upload' && (
                                                    <div className="mt-2">
                                                        <a
                                                            href={item.selectedPower.prescriptionImage}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-800 underline"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            View Uploaded Prescription Image
                                                        </a>
                                                    </div>
                                                )}

                                                {/* WhatsApp note */}
                                                {item.powerSubmissionMethod === 'whatsapp' && (
                                                    <p className="text-[10px] text-green-700 dark:text-green-400 mt-1">
                                                        Customer will share power details via WhatsApp. Please verify with the customer before processing.
                                                    </p>
                                                )}

                                                {/* Skip note */}
                                                {item.powerSubmissionMethod === 'skip' && (
                                                    <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                                                        ⚠️ Customer skipped power selection. Contact customer to collect power details before shipping.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>);
}
