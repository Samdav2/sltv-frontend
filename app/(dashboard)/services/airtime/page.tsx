"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Phone, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const networks = [
    { id: "BAD", name: "MTN", color: "bg-yellow-400" },
    { id: "BAA", name: "Airtel", color: "bg-red-500" },
    { id: "BAB", name: "Glo", color: "bg-green-500" },
    { id: "BAC", name: "9mobile", color: "bg-green-800" },
];

const airtimeSchema = z.object({
    network: z.string().min(1, "Please select a network"),
    phone_number: z.string().length(11, "Phone number must be 11 digits"),
    amount: z.coerce.number().min(50, "Minimum amount is 50"),
});

type AirtimeFormValues = z.infer<typeof airtimeSchema>;

export default function AirtimePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AirtimeFormValues>({
        resolver: zodResolver(airtimeSchema) as any,
    });

    const onSubmit = async (data: AirtimeFormValues) => {
        setIsLoading(true);
        try {
            await api.post("/services/airtime", data);
            toast.success("Airtime purchase successful!");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Transaction failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNetworkSelect = (networkId: string) => {
        setSelectedNetwork(networkId);
        setValue("network", networkId);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    Buy Airtime
                </h1>
                <p className="text-gray-500 mt-2">Instant top-up for all networks</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Network Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            Select Network
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {networks.map((network) => (
                                <button
                                    key={network.id}
                                    type="button"
                                    onClick={() => handleNetworkSelect(network.id)}
                                    className={cn(
                                        "h-14 rounded-xl border-2 flex items-center justify-center font-bold transition-all duration-200",
                                        selectedNetwork === network.id
                                            ? "border-primary bg-blue-50 text-primary"
                                            : "border-gray-100 hover:border-gray-200 text-gray-600"
                                    )}
                                >
                                    {network.name}
                                </button>
                            ))}
                        </div>
                        {errors.network && (
                            <p className="text-sm text-red-500">{errors.network.message}</p>
                        )}
                    </div>

                    <Input
                        id="phone_number"
                        type="tel"
                        label="Phone Number"
                        placeholder="08012345678"
                        error={errors.phone_number?.message}
                        {...register("phone_number")}
                    />

                    <Input
                        id="amount"
                        type="number"
                        label="Amount (₦)"
                        placeholder="100"
                        error={errors.amount?.message}
                        {...register("amount")}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Purchase Airtime
                    </Button>
                </form>
            </div>
        </div>
    );
}
