"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    ShoppingCart,
    TrendingUp,
    Clock,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { format } from "date-fns";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState([
        {
            label: "Total User",
            value: "0",
            trend: "0%",
            trendUp: true,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-100",
            period: "Total registered"
        },
        {
            label: "Total Order",
            value: "0",
            trend: "0%",
            trendUp: true,
            icon: ShoppingCart,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
            period: "Total transactions"
        },
        {
            label: "Total Sales",
            value: "₦0",
            trend: "0%",
            trendUp: true,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100",
            period: "Total revenue"
        },
        {
            label: "Total Pending",
            value: "0",
            trend: "0%",
            trendUp: false,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-100",
            period: "Pending transactions"
        }
    ]);
    const [recentDeals, setRecentDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, transactionsRes] = await Promise.all([
                    api.get("/admin/users?skip=0&limit=1000"),
                    api.get("/admin/transactions?skip=0&limit=1000")
                ]);

                const usersData = usersRes.data;
                const transactionsData = transactionsRes.data;

                const users = Array.isArray(usersData) ? usersData :
                    (usersData?.items || usersData?.users || []);

                const transactions = Array.isArray(transactionsData) ? transactionsData :
                    (transactionsData?.items || transactionsData?.transactions || []);

                // Calculate Stats
                const totalUsers = users.length;
                const totalOrders = transactions.length;

                // Assuming "Sales" means successful debit transactions (money spent by users)
                const totalSales = transactions
                    .filter((t: any) => t.type === 'debit' && t.status === 'success')
                    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

                const totalPending = transactions
                    .filter((t: any) => t.status === 'pending')
                    .length;

                setStats([
                    {
                        label: "Total User",
                        value: totalUsers.toLocaleString(),
                        trend: "+",
                        trendUp: true,
                        icon: Users,
                        color: "text-purple-600",
                        bg: "bg-purple-100",
                        period: "Total registered"
                    },
                    {
                        label: "Total Order",
                        value: totalOrders.toLocaleString(),
                        trend: "+",
                        trendUp: true,
                        icon: ShoppingCart,
                        color: "text-yellow-600",
                        bg: "bg-yellow-100",
                        period: "Total transactions"
                    },
                    {
                        label: "Total Sales",
                        value: `₦${totalSales.toLocaleString()}`,
                        trend: "+",
                        trendUp: true,
                        icon: TrendingUp,
                        color: "text-green-600",
                        bg: "bg-green-100",
                        period: "Total revenue"
                    },
                    {
                        label: "Total Pending",
                        value: totalPending.toLocaleString(),
                        trend: totalPending > 0 ? "!" : "-",
                        trendUp: totalPending === 0,
                        icon: Clock,
                        color: "text-orange-600",
                        bg: "bg-orange-100",
                        period: "Pending transactions"
                    }
                ]);

                // Set Recent Deals (Last 5 transactions)
                setRecentDeals(transactions.slice(0, 5).map((t: any) => ({
                    id: t.id,
                    name: t.service_type || "Transaction",
                    location: t.reference, // Using reference as location/id placeholder
                    date: format(new Date(t.created_at), "dd.MM.yyyy - HH:mm"),
                    amount: `₦${t.amount.toLocaleString()}`,
                    status: t.status,
                    image: `https://api.dicebear.com/7.x/initials/svg?seed=${t.service_type || "T"}`
                })));

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mock chart data for now as we don't have historical aggregation endpoint
    const chartData = [
        { name: "5k", value: 20 },
        { name: "10k", value: 45 },
        { name: "15k", value: 30 },
        { name: "20k", value: 50 },
        { name: "25k", value: 35 },
        { name: "30k", value: 55 },
        { name: "35k", value: 25 },
        { name: "40k", value: 45 },
        { name: "45k", value: 60 },
        { name: "50k", value: 50 },
        { name: "55k", value: 55 },
        { name: "60k", value: 40 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Welcome back, Admin
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={cn(
                                "flex items-center font-medium",
                                stat.trendUp ? "text-green-500" : "text-red-500"
                            )}>
                                {stat.trendUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                {stat.trend}
                            </span>
                            <span className="text-gray-400">{stat.period}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Sales Details</h2>
                    <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                    </select>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#EF4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Deals Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                    <Link href="/admin/transactions" className="text-sm text-red-600 hover:text-red-700 font-medium">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 rounded-l-xl">Description</th>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Date - Time</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 rounded-r-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentDeals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                recentDeals.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                                                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                                            </div>
                                            {deal.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{deal.location}</td>
                                        <td className="px-6 py-4 text-gray-500">{deal.date}</td>
                                        <td className="px-6 py-4 text-gray-900 font-bold">{deal.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium capitalize",
                                                deal.status === "success" ? "bg-green-100 text-green-700" :
                                                    deal.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-red-100 text-red-700"
                                            )}>
                                                {deal.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
