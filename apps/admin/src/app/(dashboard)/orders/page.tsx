/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Search,
    Filter,
    Eye,
    Download,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    CreditCard,
    User,
    ShoppingBag,
    ArrowRight,
    TrendingUp,
    Activity,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/admin/PageHeader';
import { useGetAllOrdersQuery, Order } from '@/store/orderApi';
const OrderDetailsDialog = dynamic(() => import('@/components/orders/OrderDetailsDialog').then(mod => mod.OrderDetailsDialog), { ssr: false });
import { Pagination } from '@/components/admin/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

// Removed Mock order data

const statusStyles = {
    'delivered': 'bg-primary/10 text-primary border-primary/20',
    'confirmed': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'shipped': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'placed': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    'cancelled': 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusIcons = {
    'delivered': CheckCircle2,
    'confirmed': Clock,
    'shipped': Truck,
    'placed': Clock,
    'cancelled': XCircle,
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [page, setPage] = useState(1);

    const { data: response, isLoading } = useGetAllOrdersQuery({
        page: page, limit: 20, status: filterStatus
    });

    const orders = React.useMemo(() => {
        const rawOrders = response?.data?.orders || [];
        if (!debouncedSearch) return rawOrders;
        const lowSearch = debouncedSearch.toLowerCase();
        return rawOrders.filter(o =>
            o._id.toLowerCase().includes(lowSearch) ||
            o.user?.name?.toLowerCase().includes(lowSearch) ||
            o.user?.email?.toLowerCase().includes(lowSearch)
        );
    }, [response, debouncedSearch]);

    const totalOrders = response?.data?.pagination?.total || 0;

    // Quick summary calculation
    const netLiquidity = React.useMemo(() => orders.reduce((sum, o) => sum + o.finalAmount, 0), [orders]);

    const pulseStats = React.useMemo(() => [
        { label: 'Total Orders', value: totalOrders.toString(), icon: Clock, color: 'orange' },
        { label: 'Carrier Transit', value: orders.filter(o => o.orderStatus === 'shipped').length + ' Orders', icon: Truck, color: 'blue' },
        { label: 'Success (Delivered)', value: orders.filter(o => o.orderStatus === 'delivered').length + ' Units', icon: CheckCircle2, color: 'primary' },
        { label: 'Net Liquidity (View)', value: '₹' + netLiquidity.toFixed(2), icon: CreditCard, color: 'purple' },
    ], [totalOrders, orders, netLiquidity]);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12 pb-10 animate-in fade-in duration-700">
            <PageHeader
                badgeIcon={ShoppingBag}
                badgeText="Fulfillment Console"
                titleMain="Order"
                titleAccent="Logistics"
                description="Monitoring the lifecycle of luxury. From order inception to signature delivery, every shipment is a promise kept."
                showAction={false}
            >
                <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Monthly Velocity</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-xl md:text-2xl font-black italic leading-none">1,248</h4>
                        <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
                            <TrendingUp className="h-3 w-3" /> +18.4%
                        </div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="xl"
                    className="h-16 md:h-20 w-full sm:w-auto"
                >
                    <div className="flex flex-col items-center gap-0.5 md:gap-1">
                        <Download className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Export Ledger</span>
                    </div>
                </Button>
            </PageHeader>

            {/* Fulfillment Pulse Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
                {pulseStats.map((stat, i) => (
                    <div key={i} className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card border shadow-sm border-primary/5 flex items-center gap-4 group hover:border-primary/20 transition-all">
                        <div className={cn(
                            "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                            stat.color === 'primary' ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        )}>
                            <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{stat.label}</p>
                            <h4 className="text-lg md:text-xl font-black italic">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-4 p-4 rounded-[2rem] bg-card/50 border border-primary/5 backdrop-blur-md mx-4 md:mx-0">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by order ID, customer name, or email..."
                        className="h-12 w-full pl-12 pr-4 bg-muted/20 border-none rounded-xl font-bold text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                    {['All Status', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setFilterStatus(filter)}
                            className={cn(
                                "px-5 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                                filterStatus === filter
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40"
                            )}>
                            {filter}
                        </button>
                    ))}
                    <div className="h-12 w-[2px] bg-border/50 mx-1 shrink-0" />
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-muted/20 shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Orders Table - Enhanced High-End List */}
            <div className="rounded-[3rem] bg-card border shadow-md border-primary/5 overflow-hidden relative mx-4 md:mx-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-muted/10">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">ID</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-center">Date</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Customer</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 w-16 text-center">Units</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Ledger Total</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Delivery</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {orders.map((order) => {
                                const StatusIcon = statusIcons[order.orderStatus as keyof typeof statusIcons] || Clock;
                                return (
                                    <tr key={order._id} className="group hover:bg-primary/[0.03] transition-all duration-500">
                                        <td className="p-8">
                                            <span className="font-black text-xs uppercase tracking-widest text-primary italic leading-none">#{order._id.slice(-8)}</span>
                                        </td>
                                        <td className="p-8 text-center text-xs font-bold text-muted-foreground whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0 border border-white/10 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform">
                                                    {order.user?.name ? (
                                                        <span className="font-black text-primary capitalize">{order.user.name[0]}</span>
                                                    ) : (
                                                        <User className="h-4 w-4 text-primary" />
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[12px] uppercase tracking-tight leading-none mb-1">{order.user?.name || 'Unknown User'}</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{order.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center font-black text-xs">
                                            {order.items.reduce((acc, item) => acc + item.qty, 0)}
                                        </td>
                                        <td className="p-8">
                                            <span className="text-sm font-black italic tracking-tighter">₹{order.finalAmount.toFixed(2)}</span>
                                        </td>
                                        <td className="p-8">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                                statusStyles[order.orderStatus as keyof typeof statusStyles]
                                            )}>
                                                <StatusIcon className="h-3 w-3" />
                                                {order.orderStatus}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    order.paymentStatus === 'paid' ? "bg-primary shadow-[0_0_8px_rgba(34,197,94,1)]" : "bg-orange-500"
                                                )} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">{order.paymentMethod}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all group/eye"
                                                onClick={() => { setSelectedOrder(order as unknown as Order); setIsDialogOpen(true); }}
                                            >
                                                <Eye className="h-4 w-4 group-hover:scale-125 transition-transform" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Audit - Refined Footer */}
                <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/[0.01] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Activity className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Basket Value</p>
                            <h4 className="text-lg md:text-xl font-black italic">₹{
                                orders.reduce((acc, order) => acc + order.finalAmount, 0) / orders.length
                            }</h4>
                        </div>
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={response?.data?.pagination?.pages || 1}
                        onPageChange={setPage}
                    />
                </div>
            </div>


            <OrderDetailsDialog
                order={selectedOrder}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div >
    );
}
