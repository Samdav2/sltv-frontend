"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Wallet,
    History,
    User,
    LogOut,
    Wifi,
    Phone,
    Tv,
    Zap,
    Headset,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Wallet, label: "Fund Wallet", href: "/fund-wallet" },
    { icon: Wifi, label: "Buy Data", href: "/services/data" },
    { icon: Phone, label: "Buy Airtime", href: "/services/airtime" },
    { icon: Tv, label: "SLTV", href: "/services/sltv" },
    { icon: Zap, label: "Electricity", href: "/services/electricity" },
    { icon: History, label: "Transactions", href: "/transactions" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Headset, label: "Support", href: "/support" },
];

export function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
    const pathname = usePathname();

    // Fetch tickets for notification badge
    const { data: tickets } = useQuery({
        queryKey: ["user-tickets"],
        queryFn: async () => {
            const res = await api.get("/support/");
            return res.data;
        },
        refetchInterval: 30000,
        retry: false,
    });

    // Calculate unread count with useEffect to avoid hydration mismatch
    const [supportBadgeCount, setSupportBadgeCount] = useState(0);

    useEffect(() => {
        if (tickets && Array.isArray(tickets)) {
            try {
                const seenTickets = JSON.parse(localStorage.getItem("seen_tickets") || "[]");
                const unreadTickets = tickets.filter((t: any) =>
                    (t.status === 'in_progress' || t.status === 'resolved') &&
                    !seenTickets.includes(t.id)
                );
                setSupportBadgeCount(unreadTickets.length);
            } catch (e) {
                console.error("Error parsing seen_tickets", e);
            }
        }
    }, [tickets]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <aside className={cn("flex flex-col w-72 bg-white h-screen fixed left-0 top-0 z-30 border-r border-gray-100", className)}>
            {/* Logo */}
            <div className="p-6 h-20 flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-gray-900" onClick={onClose}>
                    Swift<span className="gradient-text">VTU</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        let showBadge = false;
                        let badgeCount = 0;

                        if (item.label === "Support") {
                            badgeCount = supportBadgeCount;
                            showBadge = badgeCount > 0;
                        }

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "w-5 h-5 flex-shrink-0",
                                            isActive ? "text-white" : "text-gray-400"
                                        )}
                                    />
                                    <span className="text-sm flex-1">{item.label}</span>
                                    {showBadge && (
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {badgeCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </Button>
            </div>
        </aside>
    );
}
