import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 pt-20 pb-8">
            <div className="container-tight">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-white mb-6 block tracking-tight">
                            Swift<span className="text-primary">VTU</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            Your reliable partner for instant digital payments and virtual
                            top-ups. Fast, secure, and convenient.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary text-gray-400 hover:text-white transition-all duration-300"
                            >
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary text-gray-400 hover:text-white transition-all duration-300"
                            >
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary text-gray-400 hover:text-white transition-all duration-300"
                            >
                                <Instagram className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {["About Us", "Services", "Pricing", "API Documentation"].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href="#"
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Legal</h4>
                        <ul className="space-y-3">
                            {["Privacy Policy", "Terms of Service", "Refund Policy"].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href="#"
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">
                            Contact Us
                        </h4>
                        <div className="space-y-4">
                            <p className="flex items-center gap-3 text-sm">
                                <Mail className="text-primary w-4 h-4" /> support@swiftvtu.com
                            </p>
                            <p className="flex items-center gap-3 text-sm">
                                <Phone className="text-primary w-4 h-4" /> +234 800 123 4567
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm">© {new Date().getFullYear()} SwiftVTU. All rights reserved.</p>
                    <p className="text-sm">Made with ❤️ in Nigeria</p>
                </div>
            </div>
        </footer>
    );
}
