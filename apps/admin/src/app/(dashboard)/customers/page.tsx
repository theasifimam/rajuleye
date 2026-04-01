/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Shield,
    ShieldAlert,
    ShieldCheck,
    User as UserIcon,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
const UserDialog = dynamic(() => import('@/components/admin/UserDialog').then(mod => mod.UserDialog), { ssr: false });
const BroadcastDialog = dynamic(() => import('@/components/admin/BroadcastDialog').then(mod => mod.BroadcastDialog), { ssr: false });
import { PageHeader } from '@/components/admin/PageHeader';
import { useGetUsersQuery, useDeleteUserMutation, type User } from '@/store/userApi';
import { useGetSubscribersQuery, useSendNewsletterMutation } from '@/store/subscriberApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/admin/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'moderator' | 'subscribers'>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [page, setPage] = useState(1);

    // Subscribers Modals & state
    const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);


    // RTK Query
    const { data: usersData, isLoading, isError } = useGetUsersQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const { data: subscribersData, isLoading: isSubLoading } = useGetSubscribersQuery();
    const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation();

    const users = usersData?.data || [];
    const subscribers = subscribersData?.data || [];
    const activeCount = subscribers.filter(s => s.isActive).length;

    const filteredUsers = useMemo(() => {
        const lowSearch = debouncedSearch.toLowerCase();
        return users.filter(user => {
            const matchesSearch =
                user.name?.toLowerCase().includes(lowSearch) ||
                user.email?.toLowerCase().includes(lowSearch) ||
                user._id.toLowerCase().includes(lowSearch);

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, debouncedSearch, roleFilter]);

    const filteredSubscribers = useMemo(() => {
        const lowSearch = debouncedSearch.toLowerCase();
        return subscribers.filter(sub => {
            return sub.email?.toLowerCase().includes(lowSearch);
        });
    }, [subscribers, debouncedSearch]);

    const pulseStats = useMemo(() => [
        { label: 'Active Session Rate', value: '78.4%', icon: TrendingUp, color: 'primary' },
        { label: 'Admin Authorities', value: '12 Leads', icon: ShieldCheck, color: 'purple' },
        { label: 'Pending Verifications', value: '42 Guests', icon: ShieldAlert, color: 'orange' },
    ], []);

    const openAddDialog = () => {
        setEditingUser(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to terminate this identity?')) {
            try {
                await deleteUser(id).unwrap();
                toast.success('Identity purged from registry');
            } catch (err: unknown) {
                toast.error((err as { data?: { message?: string } })?.data?.message || 'Purge failed');
            }
        }
    };


    if (isLoading || isSubLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-destructive text-center">
                <XCircle className="h-12 w-12" />
                <p className="font-black uppercase tracking-widest text-[10px]">Registry Access Denied</p>
                <p className="text-sm font-medium">Failed to retrieve citizen database</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12 pb-10">
            <PageHeader
                badgeIcon={Shield}
                badgeText="Identity Command"
                titleMain="The Citizen"
                titleAccent="Registry"
                description="Curating the global community of Rajul Eye ambassadors. Managing privileges and profiles with architectural precision."
            >
                <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Verified Ambassadors</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-xl md:text-2xl font-black italic leading-none">{users.length * 312}</h4>
                        <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
                            <TrendingUp className="h-3 w-3" /> +24
                        </div>
                    </div>
                </div>
                <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px]">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Active Subscribers</p>
                    <div className="flex items-end justify-between">
                        <h4 className="text-xl md:text-2xl font-black italic leading-none">{activeCount}</h4>
                        <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
                            <ShieldCheck className="h-3 w-3" /> Verified
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        onClick={() => setIsBroadcastDialogOpen(true)}
                        variant="signature"
                        size="xl"
                        className="h-16 md:h-20 w-full sm:w-auto"
                    >
                        <div className="flex flex-col items-center gap-0.5 md:gap-1">
                            <Send className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:scale-110 transition-transform duration-500" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Broadcast</span>
                        </div>
                    </Button>
                    <Button
                        onClick={openAddDialog}
                        variant="signature"
                        size="xl"
                        className="h-16 md:h-20 w-full sm:w-auto"
                    >
                        <div className="flex flex-col items-center gap-0.5 md:gap-1">
                            <UserIcon className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:scale-110 transition-transform duration-500" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Enroll</span>
                        </div>
                    </Button>
                </div>
            </PageHeader>

            {/* Registry Health Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
                {pulseStats.map((stat, i) => (
                    <div key={i} className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card border shadow-sm flex items-center gap-4 md:gap-5 group hover:border-primary/20 transition-all">
                        <div className={cn(
                            "h-10 w-10 md:h-12 md:w-12 rounded-2xl md:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                            stat.color === 'primary' ? "bg-primary text-primary-foreground" :
                                stat.color === 'purple' ? "bg-purple-500/10 text-purple-600" : "bg-orange-500/10 text-orange-600"
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
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-[2rem] bg-card/50 border border-primary/5 backdrop-blur-md mx-4 md:mx-0">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name, email or registry ID..."
                        className="h-11 md:h-12 w-full pl-12 pr-4 bg-muted/20 border-none rounded-2xl font-bold text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="flex bg-muted/20 p-1 rounded-2xl border border-primary/5 items-center">
                        {(['all', 'user', 'moderator', 'admin', 'subscribers'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    roleFilter === role ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-[3rem] bg-card border shadow-md border-primary/5 overflow-hidden relative mx-4 md:mx-0">
                <div className="overflow-x-auto">
                    {roleFilter === 'subscribers' ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-muted/10">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 w-24">#</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Email Address</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Subscribed On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {filteredSubscribers.map((sub, idx) => (
                                    <tr key={sub._id} className="group hover:bg-primary/[0.03] transition-all duration-500">
                                        <td className="p-8 text-[10px] font-bold text-muted-foreground">{idx + 1}</td>
                                        <td className="p-8 text-sm font-bold tracking-tight">{sub.email}</td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-1.5 w-1.5 rounded-full ${sub.isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${sub.isActive ? 'text-primary' : 'text-muted-foreground/50'}`}>
                                                    {sub.isActive ? 'Active' : 'Unsubscribed'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-xs font-bold">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {filteredSubscribers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">No subscribers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-muted/10">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 w-24 text-center">Avatar</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Identity</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-center">Privilege</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Verification</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Last Presence</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="group hover:bg-primary/[0.03] transition-all duration-500">
                                        <td className="p-8">
                                            <div className="relative h-14 w-14 mx-auto">
                                                <div className="absolute inset-0 bg-primary/10 blur-lg rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-sm bg-muted flex items-center justify-center z-10">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-black text-primary uppercase">{user.name?.split(' ').map(n => n[0]).join('')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="max-w-[250px]">
                                                <p className="font-black text-sm uppercase tracking-tight mb-1 leading-none">{user.name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground lowercase tracking-widest flex items-center gap-1.5 opacity-60 italic">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                                user.role === 'admin' ? "bg-primary text-primary-foreground border-primary shadow-primary/20" :
                                                    user.role === 'moderator' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                                        "bg-muted/50 text-muted-foreground border-primary/5"
                                            )}>
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                {user.isEmailVerified ? (
                                                    <div className="flex items-center gap-1.5 text-primary">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-muted-foreground/40">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold leading-none mb-1.5">{new Date(user.createdAt).toLocaleDateString()}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        user.isActive ? "bg-primary shadow-[0_0_8px_rgba(34,197,94,1)]" : "bg-muted-foreground/30"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest",
                                                        user.isActive ? "text-primary" : "text-muted-foreground/50"
                                                    )}>{user.isActive ? 'Active' : 'Standby'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(user)}
                                                    className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isDeleting}
                                                    onClick={() => handleDelete(user._id)}
                                                    className="h-12 w-12 rounded-2xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <UserDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    user={editingUser}
                />

                {/* Pagination */}
                <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/[0.01] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center sm:text-left">Registry Sync: {roleFilter === 'subscribers' ? filteredSubscribers.length : filteredUsers.length} active verified identities</p>
                    <Pagination
                        currentPage={page}
                        totalPages={1}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            <BroadcastDialog
                isOpen={isBroadcastDialogOpen}
                onOpenChange={setIsBroadcastDialogOpen}
                activeCount={activeCount}
            />
        </div>
    );
}
