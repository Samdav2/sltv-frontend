"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
    username: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append("username", data.username);
            formData.append("password", data.password);

            const response = await api.post("/auth/login/access-token", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const { access_token, name } = response.data;
            localStorage.setItem("token", access_token);
            if (name) {
                localStorage.setItem("userName", name);
            }
            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Incorrect email or password";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
                <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    id="username"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    error={errors.username?.message}
                    {...register("username")}
                />

                <div className="space-y-1">
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register("password")}
                    />
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary hover:text-secondary"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-primary hover:text-secondary"
                    >
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
}
