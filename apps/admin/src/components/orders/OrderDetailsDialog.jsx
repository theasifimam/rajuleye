import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useUpdateOrderStatusMutation } from '@/store/orderApi';
import { CheckCircle2, Clock, Truck, XCircle, Box, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
const ORDER_STATUSES = [
    { value: 'placed', label: 'Placed', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { value: 'processing', label: 'Processing', icon: Box },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
    { value: 'returned', label: 'Returned', icon: AlertCircle },
];
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
    return (<Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-background/95 backdrop-blur-xl border-primary/20">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        Order #{order._id.slice(-8)}
                    </DialogTitle>
                    <DialogDescription>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </DialogDescription>
                </DialogHeader>
                <div className="h-[500px] max-h-[70vh] pr-1 overflow-y-auto ">
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
                                    <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                        {order.paymentStatus}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-muted/10 rounded-2xl border border-primary/5 overflow-hidden">
                        <div className="p-4 border-b border-primary/5 bg-muted/20">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Items List</h4>
                        </div>
                        <div className="p-4 space-y-3">
                            {order.items.map((item, idx) => (<div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-xl border border-primary/5">
                                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                        {item.image ? (<img src={item.image} alt={item.name} className="w-full h-full object-cover"/>) : (<Box className="w-6 h-6 text-muted-foreground opacity-50"/>)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Qty: {item.qty} • ₹{item.price}
                                            {item.lensType && ` • ${item.lensType}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black italic">₹{(item.qty * item.price).toFixed(2)}</p>
                                    </div>
                                </div>))}
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>);
}
