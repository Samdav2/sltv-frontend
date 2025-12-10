"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    ArrowLeft,
    UserPlus,
    User,
    Mail,
    Lock,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";

const createUserSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    is_superuser: z.boolean().default(false),
    is_active: z.boolean().default(true),
    is_verified: z.boolean().default(false),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function AdminCreateUserPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema) as any,
        defaultValues: {
            is_active: true,
            is_superuser: false,
            is_verified: false,
        }
    });

    const onSubmit = async (data: CreateUserFormValues) => {
        setIsSaving(true);
        try {
            await api.post("/admin/users", data);
            toast.success("User created successfully");
            router.push("/admin/users");
        } catch (error: any) {
            console.error("Failed to create user", error);
            toast.error(error.response?.data?.detail || "Failed to create user");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                    <p className="text-sm text-gray-500">Add a new user to the system</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Enter the information for the new user</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        {...register("full_name")}
                                        className="pl-10"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.full_name && (
                                    <p className="text-xs text-red-500">{errors.full_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        {...register("email")}
                                        className="pl-10"
                                        placeholder="john@example.com"
                                        type="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        {...register("password")}
                                        className="pl-10"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium text-gray-900">Active</label>
                                        <p className="text-xs text-gray-500">Can log in</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                        {...register("is_active")}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium text-gray-900">Admin</label>
                                        <p className="text-xs text-gray-500">Superuser</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                        {...register("is_superuser")}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium text-gray-900">Verified</label>
                                        <p className="text-xs text-gray-500">Email verified</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                        {...register("is_verified")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
