import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md mx-auto">
                {/* Visuals */}
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
                <p className="text-gray-500">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Link href="/login">
                        <Button variant="primary" className="w-full sm:w-auto">
                            Login
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="outline" className="w-full sm:w-auto">
                            Sign Up
                        </Button>
                    </Link>
                </div>

                <div className="pt-8">
                    <Link href="/" className="text-sm text-gray-500 hover:text-primary flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
