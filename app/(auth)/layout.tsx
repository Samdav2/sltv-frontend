import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/50 blur-3xl"></div>
                <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-100/50 blur-3xl"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Swift<span className="text-primary">VTU</span>.
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
