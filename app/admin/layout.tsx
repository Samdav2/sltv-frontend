"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Bell, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Skip auth check for login and register pages
        if (pathname === "/admin/login" || pathname === "/admin/register") {
            setIsAuthenticated(true); // Allow login/register page to render
            return;
        }

        // Check for admin token
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.replace("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);

    // Show loading while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    // Login and Register pages don't need the layout wrapper
    if (pathname === "/admin/login" || pathname === "/admin/register") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
            {/* Sidebar (Desktop) */}
            <div className="hidden lg:flex flex-shrink-0">
                <AdminSidebar className="h-full border-r border-gray-200" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 z-30 px-4 sm:px-6 py-4 flex justify-between items-center">
                    <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight text-gray-900">
                        Swift<span className="gradient-text">VTU Admin</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-xl w-10 h-10">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <AdminSidebar className="h-full" />
            </div>
        </div>
    );
}
