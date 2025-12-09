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

const registerSchema = z.object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            await api.post("/users/", {
                email: data.email,
                password: data.password,
                full_name: data.full_name,
            });

            toast.success("Account created successfully! Please log in.");
            router.push("/login");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Create Account</h3>
                <p className="text-gray-500 mt-2">Join SwiftVTU to start transacting</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    id="full_name"
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    error={errors.full_name?.message}
                    {...register("full_name")}
                />

                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:text-secondary"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
