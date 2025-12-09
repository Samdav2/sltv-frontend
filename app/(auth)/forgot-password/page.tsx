"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        try {
            // The API expects email as a query parameter
            await api.post(`/auth/forgot-password?email=${encodeURIComponent(data.email)}`);
            setIsSubmitted(true);
            toast.success("Reset link sent!");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-500 mb-8">
                    We have sent a password reset link to your email address.
                </p>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Forgot Password?</h3>
                <p className="text-gray-500 mt-2">
                    Enter your email to reset your password
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Send Reset Link
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-primary flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
            </div>
        </div>
    );
}
