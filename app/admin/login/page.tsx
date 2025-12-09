"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Shield, Lock, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const adminLoginSchema = z.object({
    username: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginFormValues>({
        resolver: zodResolver(adminLoginSchema),
    });

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            router.replace("/admin/dashboard");
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    const onSubmit = async (data: AdminLoginFormValues) => {
        setIsLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append("username", data.username);
            formData.append("password", data.password);

            // Assuming admin uses the same token endpoint but we might need to verify role later
            // Or maybe there's a specific admin login? The docs didn't specify, so using standard login.
            // We will check role after login or rely on backend to allow access.
            // Admin login endpoint
            const response = await api.post("/admin/auth/login/access-token", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const { access_token } = response.data;
            localStorage.setItem("admin_token", access_token); // Store separately to avoid conflict? Or same?
            // Let's use the same token for now, but maybe we should check if user is superuser.
            // For now, just redirect to admin dashboard.

            toast.success("Admin login successful!");
            router.push("/admin/dashboard");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Invalid admin credentials";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-red-100 rounded-xl mb-4">
                        <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-gray-500 mt-2">Secure access for administrators</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        id="username"
                        type="email"
                        label="Admin Email"
                        placeholder="admin@sltv.com"
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                        isLoading={isLoading}
                    >
                        <Lock className="w-4 h-4 mr-2" /> Access Dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
}
