"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    LifeBuoy,
    LogOut,
    Settings,
    Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface AdminSidebarProps {
    className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: CreditCard, label: "Transactions", href: "/admin/transactions" },
        { icon: LifeBuoy, label: "Support Tickets", href: "/admin/support" },
        { icon: Tag, label: "Services & Prices", href: "/admin/services" },
    ];

    // Fetch tickets for notification badge
    const { data: tickets } = useQuery({
        queryKey: ["admin-tickets"],
        queryFn: async () => {
            const res = await api.get("/admin/support/tickets?limit=1000");
            // Handle various response structures
            if (Array.isArray(res.data)) return res.data;
            if (res.data?.items) return res.data.items;
            if (res.data?.tickets) return res.data.tickets;
            if (res.data?.data) return res.data.data;
            return [];
        },
        refetchInterval: 30000,
        retry: false,
    });

    // Calculate unread count (Open or Pending tickets)
    const supportBadgeCount = Array.isArray(tickets)
        ? tickets.filter((t: any) => t.status === 'open' || t.status === 'pending').length
        : 0;

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    };

    return (
        <aside className={cn(
            "w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0",
            className
        )}>
            <div className="p-6 border-b border-gray-50">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/20">
                        S
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        Swift<span className="text-red-600">VTU</span>
                    </span>
                    <span className="ml-auto text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">ADMIN</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    Menu
                </div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    let showBadge = false;
                    let badgeCount = 0;

                    if (item.label === "Support Tickets") {
                        badgeCount = supportBadgeCount;
                        showBadge = badgeCount > 0;
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-red-50 text-red-600 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-full" />
                            )}
                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                            )} />
                            <span className="font-medium flex-1">{item.label}</span>
                            {showBadge && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {badgeCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-50">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm">
                            <Image
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                                alt="Admin"
                                width={40}
                                height={40}
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">Super Admin</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100/50 h-9"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
