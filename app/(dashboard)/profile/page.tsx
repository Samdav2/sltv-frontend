"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    lga: z.string().optional(),
    nin: z.string().optional(),
    bvn: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/profile/me");
                reset(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        try {
            await api.post("/profile/me", data);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Failed to update profile.";
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    My Profile
                </h1>
                <p className="text-gray-500 mt-2">Manage your personal information</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        id="full_name"
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.full_name?.message}
                        {...register("full_name")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="phone_number"
                            label="Phone Number"
                            placeholder="08012345678"
                            error={errors.phone_number?.message}
                            {...register("phone_number")}
                        />
                        <Input
                            id="address"
                            label="Address"
                            placeholder="123 Street Name"
                            error={errors.address?.message}
                            {...register("address")}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="state"
                            label="State"
                            placeholder="Lagos"
                            error={errors.state?.message}
                            {...register("state")}
                        />
                        <Input
                            id="lga"
                            label="LGA"
                            placeholder="Ikeja"
                            error={errors.lga?.message}
                            {...register("lga")}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="nin"
                            label="NIN"
                            placeholder="National Identity Number"
                            error={errors.nin?.message}
                            {...register("nin")}
                        />
                        <Input
                            id="bvn"
                            label="BVN"
                            placeholder="Bank Verification Number"
                            error={errors.bvn?.message}
                            {...register("bvn")}
                        />
                    </div>

                    <Button type="submit" size="lg" isLoading={isSaving}>
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
}
