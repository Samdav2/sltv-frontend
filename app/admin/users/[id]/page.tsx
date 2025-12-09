"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    Shield,
    User,
    Mail,
    Lock,
    CheckCircle2,
    XCircle,
    Loader2,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";

const userSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    is_active: z.boolean(),
    is_superuser: z.boolean(),
    is_verified: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AdminUserDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/admin/users/${userId}`);
                const userData = response.data;
                setUser(userData);
                setValue("full_name", userData.full_name || "");
                setValue("email", userData.email);
                setValue("is_active", userData.is_active);
                setValue("is_superuser", userData.is_superuser);
                setValue("is_verified", userData.is_verified);
            } catch (error) {
                console.error("Failed to fetch user", error);
                toast.error("Failed to load user details");
                router.push("/admin/users");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, setValue, router]);

    const onSubmit = async (data: UserFormValues) => {
        setIsSaving(true);
        try {
            await api.put(`/admin/users/${userId}`, data);
            toast.success("User updated successfully");
            router.refresh();
        } catch (error: any) {
            console.error("Failed to update user", error);
            toast.error(error.response?.data?.detail || "Failed to update user");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetPassword = async () => {
        const newPassword = prompt("Enter new password for user:");
        if (!newPassword) return;

        try {
            await api.post(`/admin/users/${userId}/reset-password?new_password=${newPassword}`);
            toast.success("Password reset successfully");
        } catch (error: any) {
            console.error("Failed to reset password", error);
            toast.error("Failed to reset password");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                    <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                    <p className="text-sm text-gray-500">Manage user details and permissions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update user's personal details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-medium text-gray-900">Active Status</label>
                                            <p className="text-xs text-gray-500">User can log in</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                            {...register("is_active")}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-medium text-gray-900">Superuser</label>
                                            <p className="text-xs text-gray-500">Full admin access</p>
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

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage password and access</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-gray-700"
                                onClick={handleResetPassword}
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Reset Password
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>Irreversible actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                className="w-full justify-start bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
