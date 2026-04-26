'use client';
import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useGetMyOrdersQuery } from '@/store/orderApi';
import Image from 'next/image';
export function OrdersDialog({ isOpen, onOpenChange }) {
    const { data: ordersData, isLoading } = useGetMyOrdersQuery({}, { skip: !isOpen });
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const orders = ordersData?.data?.orders || [];
    return (<ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} title={selectedOrder ? 'Tracking Detail' : 'Order History'} className="sm:max-w-[700px] border border-border/50" headerClassName="h-auto bg-transparent border-b border-border/20 text-foreground items-start py-6 px-8 [&>div.absolute]:hidden" contentClassName="w-full items-stretch p-6 sm:p-8 custom-scrollbar">
            <div className="space-y-4">
                {selectedOrder && (<button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
                        <ChevronRight className="h-3 w-3 rotate-180"/> Back to History
                    </button>)}

                {!selectedOrder ? (<div className="space-y-4">
                        {isLoading ? (<div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
                                <Loader2 className="h-10 w-10 animate-spin"/>
                                <p className="font-bold">Loading your orders...</p>
                            </div>) : orders.length > 0 ? (orders.map((order) => (<div key={order._id} onClick={() => setSelectedOrder(order)} className="group bg-muted/20 rounded-[2rem] border border-border/50 p-6 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-sm font-bold text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm", order.orderStatus === 'delivered' ? "bg-green-500/10 text-green-600" :
                    ['cancelled', 'returned'].includes(order.orderStatus) ? "bg-destructive/10 text-destructive" :
                        "bg-blue-500/10 text-blue-600")}>
                                            {order.orderStatus}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex -space-x-4 overflow-hidden">
                                            {order.items.slice(0, 3).map((item, idx) => (<div key={idx} className="h-12 w-12 rounded-2xl bg-muted border-4 border-background flex items-center justify-center overflow-hidden shadow-inner">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover"/>
                                                </div>))}
                                            {order.items.length > 3 && (<div className="h-12 w-12 rounded-2xl bg-primary text-white border-4 border-background flex items-center justify-center text-xs font-bold leading-none">
                                                    +{order.items.length - 3}
                                                </div>)}
                                        </div>
                                        <div className="flex-1"/>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                                            <p className="text-lg font-black text-foreground">₹{order.finalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                            <Truck className="h-3.5 w-3.5"/> Track Shipment
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform"/>
                                    </div>
                                </div>))) : (<div className="py-20 text-center space-y-4 opacity-40">
                                <ShoppingBag className="h-16 w-16 mx-auto"/>
                                <div className="space-y-1">
                                    <p className="font-black text-xl">No orders found</p>
                                    <p className="text-sm font-medium">Looks like you haven't placed any orders yet.</p>
                                </div>
                            </div>)}
                    </div>) : (<div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Tracking Info Header */}
                        <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-lg">Tracking: {selectedOrder._id.slice(-8).toUpperCase()}</h4>
                                <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center">
                                    <Truck className="h-5 w-5"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Status</span>
                                    <span className="font-bold capitalize">{selectedOrder.orderStatus}</span>
                                </div>
                                <div className="h-8 w-px bg-border/50"/>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Placed On</span>
                                    <span className="font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Items Summary</h5>
                            {selectedOrder.items.map((item, idx) => (<Link key={idx} href={`/product/${item.product}`} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-all group/item">
                                    <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden flex-shrink-0 group-hover/item:scale-105 transition-transform duration-500">
                                        <Image src={item.image} alt={item.name} className="h-full w-full object-cover" width={100} height={100}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate group-hover/item:text-primary transition-colors">{item.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium">Qty: {item.qty} • ₹{item.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm">₹{(item.price * item.qty).toFixed(2)}</p>
                                    </div>
                                </Link>))}
                        </div>

                        {/* Simplified Tracking Timeline for real data */}
                        <div className="space-y-0 relative pl-4">
                            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-border/50"/>

                            {[
                { status: 'placed', label: 'Order Placed', date: selectedOrder.createdAt },
                { status: 'confirmed', label: 'Confirmed', date: '' },
                { status: 'processing', label: 'Processing', date: '' },
                { status: 'shipped', label: 'Shipped', date: '' },
                { status: 'delivered', label: 'Delivered', date: '' }
            ].map((step, idx) => {
                const orderStatusLevels = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
                const currentLevel = orderStatusLevels.indexOf(selectedOrder.orderStatus);
                const stepLevel = orderStatusLevels.indexOf(step.status);
                const isCompleted = stepLevel <= currentLevel && !['cancelled', 'returned'].includes(selectedOrder.orderStatus);
                const isCurrent = step.status === selectedOrder.orderStatus;
                return (<div key={idx} className="relative flex gap-6 pb-8 last:pb-0">
                                        <div className={cn("relative z-10 h-5 w-5 rounded-full flex items-center justify-center", isCompleted ? "bg-primary text-white" : "bg-muted text-muted-foreground border-2 border-border")}>
                                            {isCompleted ? (<CheckCircle2 className="h-3 w-3"/>) : (<div className="h-1.5 w-1.5 rounded-full bg-current"/>)}
                                            {isCurrent && (<div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25"/>)}
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <p className={cn("font-black text-sm uppercase tracking-tight", isCompleted ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                                            {step.date && (<p className="text-xs font-medium text-muted-foreground">
                                                    {new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {new Date(step.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </p>)}
                                        </div>
                                    </div>);
            })}
                        </div>

                        <Button onClick={() => setSelectedOrder(null)} className="w-full h-16 rounded-full font-black text-sm uppercase tracking-widest shadow-xl">
                            Back to History
                        </Button>
                    </div>)}
            </div>
        </ResponsiveModal>);
}
