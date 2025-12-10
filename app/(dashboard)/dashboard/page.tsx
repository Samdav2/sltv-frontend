"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Wallet,
    Wifi,
    Phone,
    Tv,
    Zap,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    Loader2,
    TrendingUp,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Wallet as WalletType, Transaction } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [wallet, setWallet] = useState<WalletType | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [walletRes, userRes] = await Promise.all([
                    api.get("/wallet/me").catch(e => {
                        console.error("Failed to fetch wallet", e);
                        return { data: null };
                    }),
                    api.get("/profile/me").catch(e => {
                        console.error("Failed to fetch profile", e);
                        return { data: null };
                    }),
                ]);

                if (walletRes.data) {
                    setWallet(walletRes.data);
                }

                if (userRes.data) {
                    const storedName = localStorage.getItem("userName");
                    setUser({ ...userRes.data, displayName: userRes.data.full_name || storedName });
                } else {
                    const storedName = localStorage.getItem("userName");
                    if (storedName) {
                        setUser({ displayName: storedName });
                    }
                }

                if (walletRes.data && walletRes.data.id) {
                    try {
                        const transactionsRes = await api.get(
                            `/wallet/${walletRes.data.id}/transactions?limit=5`
                        );
                        const txData = transactionsRes.data;
                        if (Array.isArray(txData)) {
                            setTransactions(txData);
                        } else if (txData && Array.isArray(txData.items)) {
                            setTransactions(txData.items);
                        } else if (txData && Array.isArray(txData.data)) {
                            setTransactions(txData.data);
                        }
                    } catch (txError) {
                        console.error("Failed to fetch recent transactions", txError);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                const storedName = localStorage.getItem("userName");
                if (storedName) {
                    setUser({ displayName: storedName });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const quickActions = [
        { icon: Wifi, label: "Data", desc: "Buy bundles", color: "blue", href: "/services/data" },
        { icon: Phone, label: "Airtime", desc: "Top up", color: "green", href: "/services/airtime" },
        { icon: Zap, label: "Electricity", desc: "Pay bills", color: "orange", href: "/services/electricity" },
        { icon: Tv, label: "SLTV", desc: "Subscribe", color: "indigo", href: "/services/sltv" },
    ];

    const getColorStyles = (color: string) => ({
        bg: color === 'blue' ? 'bg-blue-50' :
            color === 'green' ? 'bg-green-50' :
                color === 'orange' ? 'bg-orange-50' : 'bg-indigo-50',
        text: color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-green-600' :
                color === 'orange' ? 'text-orange-600' : 'text-indigo-600',
        hoverBg: color === 'blue' ? 'group-hover:bg-blue-100' :
            color === 'green' ? 'group-hover:bg-green-100' :
                color === 'orange' ? 'group-hover:bg-orange-100' : 'group-hover:bg-indigo-100',
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome back, {user?.displayName?.split(' ')[0] || "User"} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your account.</p>
                </div>
                <Link href="/fund-wallet">
                    <Button className="gap-2 w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> Fund Wallet
                    </Button>
                </Link>
            </div>

            {/* Wallet Card */}
            <div className="gradient-primary rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden glow-blue">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-5 h-5 opacity-80" />
                                <span className="text-sm font-medium opacity-80">Wallet Balance</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-mono">
                                ₦{wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Active</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/fund-wallet">
                            <Button variant="white" size="default" className="gap-2 text-primary font-semibold">
                                <Plus className="w-4 h-4" /> Top Up
                            </Button>
                        </Link>
                        <Link href="/transactions">
                            <Button
                                variant="ghost"
                                size="default"
                                className="bg-white/10 hover:bg-white/20 text-white border-none gap-2"
                            >
                                <History className="w-4 h-4" /> History
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => {
                        const colors = getColorStyles(action.color);
                        return (
                            <Link key={i} href={action.href}>
                                <div className="card p-6 h-full cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.text} ${colors.hoverBg} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">{action.label}</h4>
                                    <p className="text-sm text-gray-500">{action.desc}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                    <Link
                        href="/transactions"
                        className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                    >
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="card-elevated p-0 overflow-hidden">
                    {transactions.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border",
                                            tx.type === "credit"
                                                ? "bg-green-50 border-green-100 text-green-600"
                                                : "bg-red-50 border-red-100 text-red-600"
                                        )}>
                                            {tx.type === "credit" ? (
                                                <ArrowDownLeft className="w-5 h-5" />
                                            ) : (
                                                <ArrowUpRight className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{tx.description}</p>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(tx.created_at), "MMM d, h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "font-medium",
                                            tx.type === "credit" ? "text-green-600" : "text-red-600"
                                        )}>
                                            {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                                        </p>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full capitalize",
                                            tx.status === "success" ? "bg-green-100 text-green-700" :
                                                tx.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                        )}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Clock className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">No transactions yet</h4>
                            <p className="text-gray-500 text-sm mb-6 max-w-xs">
                                Start by funding your wallet to make your first transaction.
                            </p>
                            <Link href="/fund-wallet">
                                <Button variant="secondary" size="sm" className="gap-2">
                                    <Plus className="w-4 h-4" /> Fund Wallet
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
