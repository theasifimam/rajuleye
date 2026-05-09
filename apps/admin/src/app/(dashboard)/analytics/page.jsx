/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag, Activity, Download, Calendar, ArrowUpRight, Target, Zap, ChartBar, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/PageHeader';
const kpiStats = [
    { label: 'Annual Revenue', value: '₹1.42M', change: '+12.5%', isPositive: true, icon: IndianRupee, color: 'primary' },
    { label: 'Brand Conversion', value: '4.8%', change: '+0.5%', isPositive: true, icon: Target, color: 'blue' },
    { label: 'Basket Average', value: '₹642.15', change: '-2.1%', isPositive: false, icon: ShoppingBag, color: 'purple' },
    { label: 'Guest Frequency', value: '84.2k', change: '+3.4%', isPositive: true, icon: Activity, color: 'orange' },
];
const topProducts = [
    { name: 'Aether Gold Aviators', category: 'Sunglasses', sales: 1240, revenue: '₹558,000', growth: '+15.2%', momentum: 85 },
    { name: 'Lumina Clear Frames', category: 'Optical', sales: 980, revenue: '₹313,600', growth: '+8.4%', momentum: 72 },
    { name: 'Onyx Midnight Blue', category: 'Blue Light', sales: 856, revenue: '₹239,680', growth: '+22.1%', momentum: 94 },
];
export default function AnalyticsPage() {
    return (<div className="space-y-8 md:space-y-12 pb-10">
            <PageHeader badgeIcon={ChartBar} badgeText="Intelligence Engine" titleMain="Strategic" titleAccent="Intelligence" description="Decoding the metrics of excellence. Transforming complex brand signals into clear strategic foresight for the Rajul Eye dynasty.">
                <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Intelligence Sync</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-xl md:text-2xl font-black italic leading-none">99.8%</h4>
                        <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
                            <Zap className="h-3 w-3"/> Sync
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="xl" className="h-16 md:h-20 w-full sm:w-auto">
                    <div className="flex flex-col items-center gap-0.5 md:gap-1">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5"/>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Custom Range</span>
                    </div>
                </Button>
            </PageHeader>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
                {kpiStats.map((stat, i) => (<div key={i} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-card border shadow-sm border-primary/5 hover:border-primary/10 transition-all relative overflow-hidden group">
                        {/* Background Accent */}
                        <div className={cn("absolute -right-4 -top-4 w-16 h-16 md:w-24 md:h-24 blur-[40px] md:blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity", stat.color === 'primary' ? "bg-primary" : stat.color === 'blue' ? "bg-blue-500" : stat.color === 'purple' ? "bg-purple-500" : "bg-orange-500")}/>

                        <div className="flex items-start justify-between mb-6 md:mb-8 relative z-10">
                            <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", stat.color === 'primary' ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-foreground shadow-sm")}>
                                <stat.icon className="h-4 w-4 md:h-5 md:w-5"/>
                            </div>
                            <div className={cn("px-2 px-1 rounded-full text-[8px] md:text-[9px] font-black tracking-widest flex items-center gap-1 uppercase", stat.isPositive ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-500 border border-red-500/20")}>
                                {stat.isPositive ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}
                                {stat.change}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-1">{stat.label}</p>
                            <h3 className="text-xl md:text-3xl font-black tracking-tighter italic leading-none">{stat.value}</h3>
                        </div>
                    </div>))}
            </div>

            {/* Advanced Analytic Visualization Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {/* Trajectory Engine - 2/3 width */}
                <div className="lg:col-span-2 p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 flex flex-col min-h-[480px] md:h-[520px]">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <div>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Performance Trajectory</h3>
                            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Global revenue lifecycle (INR)</p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary"/>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 truncate max-w-[60px] md:max-w-none">Revenue</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-muted/20">
                                <ArrowRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto scrollbar-hide -mx-2 px-2">
                        <div className="flex items-end justify-between gap-2 md:gap-4 pt-4 min-w-[600px] md:min-w-0 h-full">
                            {[45, 60, 40, 85, 55, 75, 50, 90, 65, 95, 80, 88].map((val, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-3 md:gap-4 group/bar relative">
                                    <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-card border-2 border-primary text-foreground rounded-xl text-[9px] font-black opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none -translate-y-2 group-hover/bar:translate-y-0 z-20 whitespace-nowrap">
                                        ₹{val}k
                                    </div>
                                    <div className="w-full bg-muted/20 rounded-t-xl md:rounded-t-2xl relative overflow-hidden transition-all duration-700 h-[240px] md:h-[300px] flex items-end">
                                        <div className="w-full bg-primary/30 group-hover/bar:bg-primary transition-all duration-700 ease-out rounded-t-xl md:rounded-t-2xl relative shadow-[0_0_20px_rgba(34,197,94,0.2)]" style={{ height: `${val}%` }}>
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] md:w-[2px] h-full bg-white/20"/>
                                        </div>
                                    </div>
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                                </div>))}
                        </div>
                    </div>
                </div>

                {/* Global Distribution - 1/3 width */}
                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 flex flex-col min-h-[480px] md:h-[520px]">
                    <div className="mb-8 md:mb-12">
                        <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">Catalog Shift</h3>
                        <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Market share by category</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center relative">
                        {/* Elegant Ring Chart Concept */}
                        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full border-[1.2rem] md:border-[1.5rem] border-muted/20 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[1.2rem] md:border-[1.5rem] border-primary border-t-transparent border-r-transparent -rotate-45"/>
                            <div className="absolute inset-0 rounded-full border-[1.2rem] md:border-[1.5rem] border-blue-500 border-l-transparent border-t-transparent rotate-90 scale-[1.05]"/>
                            <div className="text-center">
                                <PieChart className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2 opacity-50"/>
                                <h4 className="text-xl md:text-2xl font-black tracking-tighter">1.4M</h4>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Volume</p>
                            </div>
                        </div>

                        <div className="w-full mt-8 md:mt-12 space-y-3 md:space-y-4">
                            {[
            { label: 'Sunglasses', value: '42%', color: 'bg-primary' },
            { label: 'Optical', value: '34%', color: 'bg-blue-500' },
            { label: 'Blue Light', value: '24%', color: 'bg-muted' },
        ].map((item, i) => (<div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2.5 w-2.5 rounded-full", item.color)}/>
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="text-xs font-black italic">{item.value}</span>
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing Table - Enhanced High-End List */}
            <div className="rounded-[3rem] bg-card border shadow-sm border-primary/5 overflow-hidden mx-4 md:mx-0">
                <div className="p-10 border-b border-primary/5 bg-primary/[0.01] flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black tracking-tight uppercase italic leading-none mb-1">Strategic Elite</h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Products with highest market momentum</p>
                    </div>
                    <Button variant="outline" className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2">
                        <Download className="mr-2 h-4 w-4"/> Full Audit
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-muted/5">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Product DNA</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Category</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Unit Velocity</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Gross Yield</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 w-48">Momentum Score</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {topProducts.map((p, i) => (<tr key={i} className="group hover:bg-primary/[0.03] transition-all duration-500">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                {p.name.charAt(0)}
                                            </div>
                                            <p className="font-black text-xs uppercase tracking-tight">{p.name}</p>
                                        </div>
                                    </td>
                                    <td className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">{p.category}</td>
                                    <td className="p-8">
                                        <span className="text-sm font-black italic">{p.sales.toLocaleString()}</span>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-sm font-black italic tracking-tighter text-primary">{p.revenue}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
                                                <span>Rank {i + 1}</span>
                                                <span>{p.momentum}/100</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${p.momentum}%` }}/>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="inline-flex items-center gap-1.5 text-primary">
                                            <ArrowUpRight className="h-4 w-4"/>
                                            <span className="text-[10px] font-black italic">{p.growth}</span>
                                        </div>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
}
