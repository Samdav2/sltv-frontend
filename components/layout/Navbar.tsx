"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed w-full z-50 transition-all duration-500",
                scrolled
                    ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/50"
                    : "bg-transparent"
            )}
        >
            <div className="container-tight">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                        Swift<span className="gradient-text">VTU</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/#home"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#features"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#services"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Services
                        </Link>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="default" className="font-semibold">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="default">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden w-10 h-10 flex items-center justify-center text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col p-6 space-y-2 transform transition-all duration-300 origin-top",
                    isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
                )}
            >
                <Link
                    href="/#home"
                    className="px-4 py-3 rounded-xl text-gray-900 font-medium hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    Home
                </Link>
                <Link
                    href="/#features"
                    className="px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    Features
                </Link>
                <Link
                    href="/#services"
                    className="px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    Services
                </Link>

                <div className="pt-4 space-y-3 border-t border-gray-100 mt-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="secondary" className="w-full">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
