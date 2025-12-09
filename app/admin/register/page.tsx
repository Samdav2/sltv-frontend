"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Shield, UserPlus } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const adminRegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["super", "manager", "team"], {
        required_error: "Please select a role",
    }),
});

type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

export default function AdminRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AdminRegisterFormValues>({
        resolver: zodResolver(adminRegisterSchema),
    });

    const onSubmit = async (data: AdminRegisterFormValues) => {
        setIsLoading(true);
        try {
            await api.post("/admin/auth/create", data);
            toast.success("Admin account created successfully! Please login.");
            router.push("/admin/login");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Failed to create admin account";
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
                    <h1 className="text-2xl font-bold text-gray-900">Admin Registration</h1>
                    <p className="text-gray-500 mt-2">Create a new admin account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Admin Name"
                            {...register("name")}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@sltv.com"
                            {...register("email")}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            onValueChange={(value) => setValue("role", value as "super" | "manager" | "team")}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="super">Super Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="team">Team Member</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-red-500">{errors.role.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2" /> Create Account
                            </>
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link href="/admin/login" className="text-red-600 hover:text-red-700 font-medium">
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
