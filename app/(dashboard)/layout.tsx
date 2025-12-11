"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bell } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Sidebar (Desktop) */}
            <Sidebar className="hidden lg:flex" />

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-30 px-4 sm:px-6 py-4 flex justify-between items-center">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="text-xl font-bold tracking-tight text-gray-900">
                        Swift<span className="gradient-text">VTU</span>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-xl w-10 h-10">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-20 bg-gray-900/30 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-40 transform transition-transform duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar className="flex" onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen">
                <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
            <WhatsAppButton />
        </div>
    );
}
