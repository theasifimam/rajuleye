import React from 'react';
import { User, Mail, Phone, Calendar as CalendarIcon, Shield } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
export function GeneralTab({ control }) {
    return (<div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField control={control} name="name" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The guest's full identity." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</FormLabel>
                            <FormControl>
                                <div className="relative group/field">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                    <Input placeholder="Alexander Pierce" {...field} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                        </FormItem>)}/>
                <FormField control={control} name="email" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="Primary communication channel." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</FormLabel>
                            <FormControl>
                                <div className="relative group/field">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                    <Input placeholder="alex.p@example.com" {...field} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                        </FormItem>)}/>
                <FormField control={control} name="mobile" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="Secure contact number." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Mobile</FormLabel>
                            <FormControl>
                                <div className="relative group/field">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                    <Input placeholder="+91 98765 43210" {...field} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                        </FormItem>)}/>
                <FormField control={control} name="role" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="Administrative privilege level." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Registry Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 rounded-xl w-full bg-muted/30 border-none font-medium focus:ring-2 focus:ring-primary/20 transition-all">
                                        <div className="flex items-center gap-3 text-left">
                                            <Shield className="h-4 w-4 text-primary"/>
                                            <SelectValue placeholder="Select role"/>
                                        </div>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-primary/10 shadow-2xl">
                                    <SelectItem value="user" className="rounded-lg text-[10px] font-black uppercase tracking-widest">User</SelectItem>
                                    <SelectItem value="moderator" className="rounded-lg text-[10px] font-black uppercase tracking-widest">Moderator</SelectItem>
                                    <SelectItem value="admin" className="rounded-lg text-[10px] font-black uppercase tracking-widest text-primary">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                        </FormItem>)}/>
                <FormField control={control} name="gender" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 rounded-xl w-full bg-muted/30 border-none font-medium focus:ring-2 focus:ring-primary/20 transition-all">
                                        <div className="flex items-center gap-3 text-left">
                                            <User className="h-4 w-4 text-primary"/>
                                            <SelectValue placeholder="Select gender"/>
                                        </div>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-primary/10 shadow-2xl">
                                    <SelectItem value="male" className="rounded-lg text-[10px] font-black uppercase tracking-widest">Male</SelectItem>
                                    <SelectItem value="female" className="rounded-lg text-[10px] font-black uppercase tracking-widest">Female</SelectItem>
                                    <SelectItem value="other" className="rounded-lg text-[10px] font-black uppercase tracking-widest">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                        </FormItem>)}/>
                <FormField control={control} name="dateOfBirth" render={({ field }) => (<FormItem className="space-y-3 flex flex-col">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Birth Manifest</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("h-11 w-full pl-3 text-left font-normal rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50"/>
                                            {field.value ? (format(new Date(field.value), "PPP")) : (<span>Pick a date</span>)}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 z-[200] rounded-3xl border-primary/10 shadow-2xl" align="start">
                                    <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} initialFocus/>
                                </PopoverContent>
                            </Popover>
                            <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                        </FormItem>)}/>
            </div>
        </div>);
}
