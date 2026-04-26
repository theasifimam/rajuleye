/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/PageHeader';
import { useGetDashboardMetricsQuery } from '@/store/dashboardApi';
export default function DashboardPage() {
    const { data, isLoading, error } = useGetDashboardMetricsQuery();
    const dashboardData = data?.data;
    const stats = React.useMemo(() => [
        {
            label: 'Total Revenue',
            value: `₹${(dashboardData?.totalRevenue || 0).toLocaleString()}`,
            change: `${(dashboardData?.growth || 0) > 0 ? '+' : ''}${(dashboardData?.growth || 0).toFixed(1)}%`,
            isPositive: (dashboardData?.growth || 0) >= 0,
            icon: DollarSign,
            color: 'primary',
            description: 'vs. last month'
        },
        {
            label: 'Active Orders',
            value: (dashboardData?.activeOrders || 0).toLocaleString(),
            change: 'Current',
            isPositive: true,
            icon: ShoppingBag,
            color: 'blue',
            description: 'In progress'
        },
        {
            label: 'New Customers',
            value: (dashboardData?.newCustomers || 0).toLocaleString(),
            change: `${(dashboardData?.customerGrowth || 0) > 0 ? '+' : ''}${(dashboardData?.customerGrowth || 0).toFixed(1)}%`,
            isPositive: (dashboardData?.customerGrowth || 0) >= 0,
            icon: Users,
            color: 'purple',
            description: 'Last 30 days'
        },
        {
            label: 'Growth',
            value: `${(dashboardData?.growth || 0) > 0 ? '+' : ''}${(dashboardData?.growth || 0).toFixed(1)}%`,
            change: 'MoM',
            isPositive: (dashboardData?.growth || 0) >= 0,
            icon: TrendingUp,
            color: 'orange',
            description: 'Organic growth'
        },
    ], [dashboardData]);
    if (isLoading) {
        return (<div className="flex h-full w-full items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>);
    }
    // Handle potential errors or missing data
    if (error || !dashboardData) {
        return (<div className="flex flex-col h-full w-full items-center justify-center min-h-[500px] text-destructive gap-4">
        <AlertCircle className="h-10 w-10"/>
        <p className="font-bold">Failed to load dashboard metrics.</p>
      </div>);
    }
    const { monthlyRevenue, monthLabels, recentOrders } = dashboardData;
    return (<div className="space-y-8 md:space-y-12 pb-10">
      <PageHeader badgeIcon={Activity} badgeText="System Status: Optimal" titleMain="The Collection" titleAccent="Perspective" description="Curating high-precision optical heritage. Your administrative command center is synchronized and ready." showAction={false}>
        <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-md border border-white/10 shadow-sm flex flex-col gap-2 min-w-[140px] md:min-w-[160px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session</p>
          <h4 className="text-xl font-black">Online</h4>
          <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full w-full bg-primary rounded-full animate-pulse"/>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex flex-col gap-2 min-w-[140px] md:min-w-[160px]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Revenue Target</p>
          <h4 className="text-xl font-black">Trending</h4>
          <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[84%] bg-white rounded-full"/>
          </div>
        </div>
      </PageHeader>

      {/* Stats Grid - Reduced Shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
        {stats.map((stat, i) => (<div key={i} className="group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-card border hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-md relative overflow-hidden">
            <div className="flex items-start justify-between mb-6 md:mb-8">
              <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", stat.color === 'primary' ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                <stat.icon className="h-4 w-4 md:h-5 md:w-5"/>
              </div>
              <div className={cn("px-2 px-1 rounded-full text-[8px] md:text-[9px] font-black tracking-widest flex items-center gap-1 uppercase", stat.isPositive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
                {stat.isPositive ? <ArrowUpRight className="h-2 w-2 md:h-2.5 md:w-2.5"/> : <ArrowDownRight className="h-2 w-2 md:h-2.5 md:w-2.5"/>}
                {stat.change}
              </div>
            </div>

            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">{stat.label}</p>
            <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-2">{stat.value}</h3>
            <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{stat.description}</p>
          </div>))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">
        {/* Activity Chart - Refined Style */}
        <div className="lg:col-span-8 p-6 md:pt-10 md:px-10 md:pb-8 rounded-[2.5rem] md:rounded-[3.5rem] bg-card border shadow-sm relative overflow-hidden group flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tight mb-1 uppercase">Order Trajectory</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global delivery performance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 md:h-10 rounded-lg md:rounded-xl px-3 md:px-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest border-2">Monthly</Button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] md:min-h-[260px] flex items-end gap-1.5 md:gap-3 justify-between pt-2 overflow-x-auto scrollbar-none">
            {monthlyRevenue.map((h, i) => (<div key={i} className="min-w-[12px] flex-1 flex flex-col items-center gap-3 md:gap-4 group/bar relative h-full">
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-primary text-primary-foreground rounded-lg text-[7px] md:text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none -translate-y-1 group-hover/bar:translate-y-0 z-10">
                  {h}%
                </div>
                <div className="w-full flex-1 flex items-end">
                  <div className="w-full bg-muted/20 rounded-t-lg md:rounded-t-xl relative overflow-hidden h-full group-hover/bar:bg-muted/30 transition-colors duration-500">
                    <div className="absolute inset-x-0 bottom-0 bg-primary/40 group-hover/bar:bg-primary transition-all duration-700 rounded-t-lg md:rounded-t-xl shadow-[0_0_15px_rgba(34,197,94,0.2)]" style={{ height: `${h}%` }}/>
                    <div className="absolute inset-x-0 bottom-0 bg-primary/5 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-500 h-full"/>
                  </div>
                </div>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{monthLabels[i]}</span>
              </div>))}
          </div>
        </div>

        {/* Recent Orders - Modern List */}
        <div className="lg:col-span-4 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-card border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">Quick Feed</h3>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
              <ArrowRight className="h-4 w-4"/>
            </Button>
          </div>

          <div className="space-y-6 flex-1">
            {recentOrders && recentOrders.length > 0 ? recentOrders.map((order, i) => (<div key={i} className="flex items-center gap-4 md:gap-5 group cursor-pointer">
                <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20", order.status === 'delivered' ? "bg-primary/5 text-primary border-primary/10" : "bg-muted/50 text-muted-foreground border-transparent")}>
                  {order.status === 'delivered' ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5"/> : <Clock className="h-4 w-4 md:h-5 md:w-5"/>}
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-[10px] md:text-[11px] uppercase tracking-wider truncate">{order.customer}</p>
                    <p className="font-black text-[11px] md:text-xs text-primary">₹{order.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em]">{order.id} • {order.time}</p>
                    <span className={cn("text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", order.status === 'delivered' ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent")}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>)) : (<p className="text-xs text-muted-foreground text-center pt-10 font-bold">No recent orders found.</p>)}
          </div>

          <Button className="w-full h-12 md:h-14 rounded-3xl mt-8 font-black uppercase tracking-widest text-[9px] md:text-[10px] bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500">
            Audit Full History
          </Button>
        </div>
      </div>
    </div>);
}
