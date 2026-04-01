'use client';

import { useGetMyOrdersQuery } from '@/store/orderApi';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
    const { data: ordersResponse, isLoading } = useGetMyOrdersQuery({ page: 0, limit: 10 });
    const orders = ordersResponse?.data?.orders || [];

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/profile">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-black tracking-tighter">My Orders</h1>
            </div>

            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-card rounded-[2.5rem] border border-border/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                        >
                            {/* Order Header */}
                            <div className="p-6 md:p-8 bg-muted/30 border-b flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</span>
                                        <span className="font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                                        <p className="font-black text-lg">₹{order.finalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2",
                                        order.orderStatus === 'delivered' ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600"
                                    )}>
                                        {order.orderStatus === 'delivered' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                        <span className="capitalize">{order.orderStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6 md:p-8 space-y-6">
                                {order.items.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/product/${item.product}`}
                                        className="flex gap-4 group/item hover:bg-muted/40 p-3 -m-3 rounded-3xl transition-all duration-300"
                                    >
                                        <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0 group-hover/item:scale-105 transition-transform duration-500">
                                            <img
                                                src={
                                                    item.image && typeof item.image === 'string' && item.image.trim() !== ''
                                                        ? (item.image.startsWith('http') || item.image.startsWith('/') || item.image.startsWith('data:') ? item.image : `/${item.image}`)
                                                        : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E`
                                                }
                                                alt={item.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover/item:text-primary transition-colors">{item.name}</h3>
                                            <p className="text-xs text-muted-foreground font-medium mt-1">Qty: {item.qty} • ₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div className="px-6 md:px-8 py-6 bg-muted/10 border-t flex items-center justify-between">
                                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                                    Track Order
                                </Button>
                                <Button className="rounded-2xl font-bold text-xs h-10 px-6 shadow-lg shadow-primary/20">
                                    Order Details
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card rounded-[3rem] border border-dashed p-12 text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">No orders found</p>
                        <Button className="mt-4 rounded-2xl">Start Shopping</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
