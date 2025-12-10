"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Settings, Bell, Download, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard } from "@/components/ui/CreditCard";
import { ExpenseChart } from "@/components/ui/ExpenseChart";
import { generateTransactionReceipt } from "@/lib/pdf-generator";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [user, setUser] = useState<any>(null);

    // Calculate chart data for the last 6 months
    const today = new Date();
    const chartData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
        const monthName = format(date, "MMM");
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthlyTotal = transactions
            .filter((tx) => {
                const txDate = new Date(tx.created_at);
                return (
                    tx.type === "debit" &&
                    tx.status === "success" &&
                    txDate.getMonth() === month &&
                    txDate.getFullYear() === year
                );
            })
            .reduce((acc, tx) => acc + tx.amount, 0);

        return {
            label: monthName,
            value: monthlyTotal,
            active: i === 5, // Current month is the last one
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user and wallet data
                const [userRes, walletRes] = await Promise.all([
                    api.get("/profile/me").catch(e => {
                        console.error("Failed to fetch user", e);
                        return { data: null };
                    }),
                    api.get("/wallet/me").catch(e => {
                        console.error("Failed to fetch wallet", e);
                        return { data: null };
                    })
                ]);

                if (userRes.data) {
                    const storedName = localStorage.getItem("userName");
                    setUser({ ...userRes.data, full_name: userRes.data.full_name || storedName });
                } else {
                    const storedName = localStorage.getItem("userName");
                    if (storedName) {
                        setUser({ full_name: storedName });
                    }
                }

                if (!walletRes.data || !walletRes.data.id) {
                    console.error("Wallet not found or invalid response", walletRes);
                    // Don't throw, just stop loading transactions
                    setIsLoading(false);
                    return;
                }

                setWalletBalance(walletRes.data.balance);
                const walletId = walletRes.data.id;

                // Then get transactions
                try {
                    const transactionsRes = await api.get(
                        `/wallet/${walletId}/transactions?limit=50`
                    );

                    // Handle potential pagination structure or direct array
                    const txData = transactionsRes.data;
                    if (Array.isArray(txData)) {
                        setTransactions(txData);
                    } else if (txData && Array.isArray(txData.items)) {
                        setTransactions(txData.items);
                    } else if (txData && Array.isArray(txData.data)) {
                        setTransactions(txData.data);
                    } else {
                        console.error("Unexpected transactions data format:", txData);
                        setTransactions([]);
                    }
                } catch (txError) {
                    console.error("Failed to fetch transactions", txError);
                    setTransactions([]);
                }
            } catch (error) {
                console.error("Critical error in dashboard data fetch", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

    const filteredTransactions = transactions.filter((tx) => {
        if (filter === "all") return true;
        return tx.type === filter;
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totalSpent = transactions
        .filter((tx) => {
            const txDate = new Date(tx.created_at);
            return (
                tx.type === "debit" &&
                tx.status === "success" &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            );
        })
        .reduce((acc, tx) => acc + tx.amount, 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search for something"
                            className="pl-10 w-64 bg-gray-50 border-transparent focus:bg-white transition-all rounded-full"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/5">
                        <Settings className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full bg-red-50 text-red-500 hover:text-red-600 hover:bg-red-100">
                        <Bell className="w-5 h-5" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                        {/* Avatar placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600" />
                    </div>
                </div>
            </div>

            {/* Cards & Expense Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">My Wallets</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <CreditCard
                            balance={walletBalance}
                            cardHolder={user?.full_name || "User Name"}
                            expiryDate="12/28"
                            cardNumber="**** **** **** 1234"
                            variant="blue"
                        />
                        {/* Total Spent Summary Card */}
                        <div className="relative w-full aspect-[1.586] rounded-3xl p-6 flex flex-col justify-between overflow-hidden bg-white text-gray-900 border border-gray-100 shadow-sm transition-all duration-300 hover:scale-[1.02]">
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-medium mb-1 text-gray-500">
                                        Total Spent
                                    </p>
                                    <h3 className="text-3xl font-bold">
                                        ₦{totalSpent.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50">
                                    <ArrowUpRight className="w-6 h-6 text-orange-500" />
                                </div>
                            </div>

                            <div className="relative z-10 mt-auto">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider mb-1 text-gray-400">
                                            Category
                                        </p>
                                        <p className="font-medium text-lg truncate">Services & Bills</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider mb-1 text-gray-400">
                                            Trend
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                                            <span className="font-medium text-sm">Variable</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <ExpenseChart data={chartData} total={totalSpent} />
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-6">
                <div className="flex items-center gap-8 border-b border-gray-100 pb-1">
                    <button
                        onClick={() => setFilter("all")}
                        className={cn(
                            "font-medium pb-3 px-1 transition-colors",
                            filter === "all" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => setFilter("credit")}
                        className={cn(
                            "font-medium pb-3 px-1 transition-colors",
                            filter === "credit" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => setFilter("debit")}
                        className={cn(
                            "font-medium pb-3 px-1 transition-colors",
                            filter === "debit" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Expense
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-4 px-6">Description</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-4 px-6">Transaction ID</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-4 px-6">Type</th>
                                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-4 px-6">Date</th>
                                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-4 px-6">Amount</th>
                                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-4 px-6">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
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
                                                    <span className="font-medium text-gray-900">{tx.description}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 text-sm">#{tx.reference?.slice(0, 8) || "N/A"}</td>
                                            <td className="py-4 px-6">
                                                <span className={cn(
                                                    "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                                                    tx.type === "credit" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                )}>
                                                    {tx.type === "credit" ? "Deposit" : "Expense"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 text-sm">
                                                {format(new Date(tx.created_at), "MMM d, h:mm a")}
                                            </td>
                                            <td className={cn(
                                                "py-4 px-6 text-right font-medium",
                                                tx.type === "credit" ? "text-green-600" : "text-red-600"
                                            )}>
                                                {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full h-8 px-4 text-xs font-medium border-gray-200 text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5"
                                                    onClick={() => generateTransactionReceipt(tx, user)}
                                                >
                                                    Download
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
