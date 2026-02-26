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

// Package options
const PACKAGES = [
    { value: 1, name: "Gold", price: 5000 },
    { value: 2, name: "Standard", price: 2500 },
];

const getErrorMessage = (error: any, fallback: string): string => {
    const detail = error.response?.data?.detail;
    if (!detail) return fallback;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
        // Handle validation error array format
        return detail.map((err: any) => {
            const field = err.loc ? err.loc.join(".") : "";
            const msg = err.msg || String(err);
            return field ? `${field}: ${msg}` : msg;
        }).join(", ");
    }
    return fallback;
};

// Schema for Verification Step
const verifySchema = z.object({
    smart_card_number: z.string().min(10, "Invalid Smart Card Number"),
});

// Schema for Purchase Step
const purchaseSchema = z.object({});

type VerifyFormValues = z.infer<typeof verifySchema>;
type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function SLTVPage() {
    const [step, setStep] = useState<"verify" | "purchase">("verify");
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [customerDetails, setCustomerDetails] = useState<any>(null);
    const [verifiedData, setVerifiedData] = useState<VerifyFormValues | null>(null);
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);

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
        handleSubmit: handleSubmitPurchase,
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
                value: selectedPackage.value,
            };
            console.log("Verification payload:", JSON.stringify(payload, null, 2));

            const response = await api.post("/services/tv/details", payload);
            setCustomerDetails(response.data.data);
            setVerifiedData(data);
            setStep("purchase");
            toast.success("Customer verified successfully!");
        } catch (error: any) {
            console.error(error);
            const message = getErrorMessage(error, "Verification failed. Please check details.");
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
                amount: selectedPackage.price,
                provider: "sltv",
                value: selectedPackage.value,
            };

            await api.post("/services/tv", payload);
            toast.success("SUBSCRIPTION SUCCESSFUL");
            setStep("verify");
            setCustomerDetails(null);
            setVerifiedData(null);
            setSelectedPackage(PACKAGES[0]);
        } catch (error: any) {
            console.error(error);
            const message = getErrorMessage(error, "Transaction failed. Please try again.");
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
            const message = getErrorMessage(error, "Refresh failed. Please try again.");
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
                <p className="text-gray-500 mt-2">Instant activation for SLTV</p>
                <p className="text-red-500 font-bold mt-1">Make Sure Your Decoder is Turned on</p>
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
                            {/* Package Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Package
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {PACKAGES.map((pkg) => (
                                        <button
                                            key={pkg.value}
                                            type="button"
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedPackage.value === pkg.value
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                        >
                                            <div className={`text-lg font-bold ${selectedPackage.value === pkg.value
                                                ? "text-indigo-600"
                                                : "text-gray-900"
                                                }`}>
                                                {pkg.name}
                                            </div>
                                            <div className={`text-xl font-bold mt-1 ${selectedPackage.value === pkg.value
                                                ? "text-indigo-700"
                                                : "text-gray-700"
                                                }`}>
                                                ₦{pkg.price.toLocaleString()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Amount to Pay</span>
                                <span className="text-2xl font-bold text-gray-900">₦{selectedPackage.price.toLocaleString()}.00</span>
                            </div>

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
