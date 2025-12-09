"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Tv, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Schema for Verification Step
const verifySchema = z.object({
    smart_card_number: z.string().min(10, "Invalid Smart Card Number"),
});

// Schema for Purchase Step
const purchaseSchema = z.object({
    amount: z.coerce.number().min(100, "Minimum amount is 100"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;
type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function SLTVPage() {
    const [step, setStep] = useState<"verify" | "purchase">("verify");
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [customerDetails, setCustomerDetails] = useState<any>(null);
    const [verifiedData, setVerifiedData] = useState<VerifyFormValues | null>(null);

    // Verification Form
    const {
        register: registerVerify,
        handleSubmit: handleSubmitVerify,
        formState: { errors: errorsVerify },
    } = useForm<VerifyFormValues>({
        resolver: zodResolver(verifySchema) as any,
    });

    // Purchase Form
    const {
        register: registerPurchase,
        handleSubmit: handleSubmitPurchase,
        formState: { errors: errorsPurchase },
    } = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseSchema) as any,
    });

    const onVerify = async (data: VerifyFormValues) => {
        setIsLoading(true);
        try {
            // Note: Amount is required by schema but ignored for verification
            const payload = {
                ...data,
                amount: 0,
                provider: "sltv",
            };

            const response = await api.post("/services/tv/details", payload);
            setCustomerDetails(response.data.data);
            setVerifiedData(data);
            setStep("purchase");
            toast.success("Customer verified successfully!");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Verification failed. Please check details.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const onPurchase = async (data: PurchaseFormValues) => {
        if (!verifiedData) return;

        setIsLoading(true);
        try {
            const payload = {
                smart_card_number: verifiedData.smart_card_number,
                amount: data.amount,
                provider: "sltv",
            };

            await api.post("/services/tv", payload);
            toast.success("SLTV Subscription Successful!");
            // Reset flow
            setStep("verify");
            setCustomerDetails(null);
            setVerifiedData(null);
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Transaction failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        if (!verifiedData) return;

        setIsRefreshing(true);
        try {
            const payload = {
                smart_card_number: verifiedData.smart_card_number,
                provider: "sltv",
            };

            await api.post("/services/tv/refresh", payload);
            toast.success("Signal Refreshed Successfully!");
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Refresh failed. Please try again.";
            toast.error(message);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Tv className="w-6 h-6 text-indigo-600" />
                    </div>
                    SLTV Subscription
                </h1>
                <p className="text-gray-500 mt-2">Instant activation for Super Link TV</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {step === "verify" && (
                    <form onSubmit={handleSubmitVerify(onVerify)} className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>
                                Verification may take 5-15 seconds. Please be patient while we connect to the SLTV server.
                            </p>
                        </div>

                        <Input
                            id="smart_card_number"
                            label="Smart Card Number"
                            placeholder="Enter Smart Card Number"
                            error={errorsVerify.smart_card_number?.message}
                            {...registerVerify("smart_card_number")}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Verify Details
                        </Button>
                    </form>
                )}

                {step === "purchase" && customerDetails && (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                                <CheckCircle className="w-5 h-5" />
                                Customer Verified
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subscriber Name:</span>
                                    <span className="font-medium capitalize">{customerDetails.subscriber_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Smart Card Number:</span>
                                    <span className="font-medium">{customerDetails.can_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mobile Number:</span>
                                    <span className="font-medium">{customerDetails.mobile_no}</span>
                                </div>
                                {customerDetails.email && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium">{customerDetails.email}</span>
                                    </div>
                                )}
                                {customerDetails.address && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Address:</span>
                                        <span className="font-medium text-right max-w-[200px] truncate">{customerDetails.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onRefresh}
                                disabled={isLoading || isRefreshing}
                                isLoading={isRefreshing}
                                className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh Signal
                            </Button>
                        </div>

                        <form onSubmit={handleSubmitPurchase(onPurchase)} className="space-y-6">
                            <Input
                                id="amount"
                                type="number"
                                label="Amount to Pay (₦)"
                                placeholder="5000"
                                error={errorsPurchase.amount?.message}
                                {...registerPurchase("amount")}
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep("verify")}
                                    disabled={isLoading || isRefreshing}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    isLoading={isLoading}
                                    disabled={isLoading || isRefreshing}
                                >
                                    Pay Subscription
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
