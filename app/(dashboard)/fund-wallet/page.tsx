"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import PaystackPayment with SSR disabled
const PaystackPayment = dynamic(
    () => import("@/components/paystack/PaystackPayment"),
    { ssr: false }
);

const fundSchema = z.object({
    amount: z.coerce.number().min(100, "Minimum amount is 100"),
    email: z.string().email("Please enter a valid email address"),
});

type FundFormValues = z.infer<typeof fundSchema>;

export default function FundWalletPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    // Placeholder key - User needs to provide the real one
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    const [paystackConfig, setPaystackConfig] = useState<any>({
        publicKey,
        reference: (new Date()).getTime().toString(), // Initial dummy reference
        amount: 0,
        email: "",
    });

    const [triggerPayment, setTriggerPayment] = useState(false);

    const onClose = () => {
        toast.info("Payment cancelled");
        setIsLoading(false);
        setTriggerPayment(false);
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FundFormValues>({
        resolver: zodResolver(fundSchema) as any,
    });

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setValue("email", storedEmail);
        }
    }, [setValue]);

    const onSuccess = async (reference: any) => {
        setIsVerifying(true);
        try {
            const ref = reference.reference;
            const verifyResponse = await api.get(`/wallet/fund/paystack/verify?reference=${ref}`);

            if (verifyResponse.data.status === 'success') {
                toast.success("Payment successful! Wallet funded.");
                // Invalidate wallet query to refresh balance
                queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                router.push("/dashboard");
            } else {
                toast.error("Payment verification failed. Please contact support.");
            }
        } catch (error: any) {
            console.error("Verification error:", error); // Kept this console.error as per diff
            toast.error("Error verifying payment");
        } finally {
            setIsVerifying(false);
            setTriggerPayment(false);
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: FundFormValues) => {
        setIsLoading(true);

        if (!publicKey) {
            toast.error("Paystack configuration missing. Please contact support.");
            setIsLoading(false);
            return;
        }





        try {
            // Initialize on backend to get access_code
            const response = await api.post(
                `/wallet/fund/paystack/initialize?amount=${data.amount}`
            );

            const responseData = response.data;
            const payload = responseData.data || responseData;

            if (!payload.access_code) {
                throw new Error("Failed to get access code from backend");
            }

            // Update config with access_code
            setPaystackConfig({
                publicKey,
                access_code: payload.access_code,
                email: data.email,
                amount: data.amount * 100, // Optional if access_code is used
            });

            setTriggerPayment(true);

        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.detail || "Failed to initialize payment.";
            toast.error(message);
            setIsLoading(false);
        }
    };

    const onError = (errors: any) => {
        if (errors.email) {
            toast.error("Email is missing. Please log out and log back in to refresh your session.");
        }
        if (errors.amount) {
            toast.error(errors.amount.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    Fund Wallet
                </h1>
                <p className="text-gray-500 mt-2">Add money to your wallet securely</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                    <Input
                        id="email"
                        type="hidden"
                        {...register("email")}
                    />

                    <Input
                        id="amount"
                        type="number"
                        label="Amount to Fund (₦)"
                        placeholder="5000"
                        error={errors.amount?.message}
                        {...register("amount")}
                    />

                    <PaystackPayment
                        config={paystackConfig}
                        trigger={triggerPayment}
                        onSuccess={onSuccess}
                        onClose={onClose}
                        isLoading={isLoading}
                        setTrigger={setTriggerPayment}
                    />
                </form>
            </div>
        </div>
    );
}
