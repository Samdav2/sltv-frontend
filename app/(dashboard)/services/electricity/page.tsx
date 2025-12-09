"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Zap, CheckCircle, Loader2, User } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const providers = [
    { id: "IKEJA", name: "Ikeja (IKEDC)", prepaidId: "AMA", postpaidId: "AMB" },
    { id: "EKO", name: "Eko (EKEDC)", prepaidId: "ANA", postpaidId: "ANB" },
    { id: "ABUJA", name: "Abuja (AEDC)", prepaidId: "AHB", postpaidId: "AHA" },
    { id: "KADUNA", name: "Kaduna (KAEDCO)", prepaidId: "AGB", postpaidId: "AGA" },
    { id: "IBADAN", name: "Ibadan (IBEDC)", prepaidId: "AEA", postpaidId: "AEB" },
    { id: "KANO", name: "Kano (KEDCO)", prepaidId: "AFA", postpaidId: "AFB" },
    { id: "PH", name: "Port Harcourt (PHED)", prepaidId: "ADB", postpaidId: "ADA" },
    { id: "JOS", name: "Jos (JEDC)", prepaidId: "ACB", postpaidId: "ACA" },
];

const electricitySchema = z.object({
    provider: z.string().min(1, "Please select a provider"),
    meter_number: z.string().min(11, "Meter number must be at least 11 digits"),
    type: z.enum(["prepaid", "postpaid"]),
    amount: z.coerce.number().min(1000, "Minimum amount is 1000"),
    phone_number: z.string().length(11, "Phone number must be 11 digits"),
});

type ElectricityFormValues = z.infer<typeof electricitySchema>;

export default function ElectricityPage() {
    const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [customerDetails, setCustomerDetails] = useState<any>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ElectricityFormValues>({
        resolver: zodResolver(electricitySchema) as any,
        defaultValues: {
            type: "prepaid",
        },
    });

    const meterNumber = watch("meter_number");
    const provider = watch("provider");
    const meterType = watch("type");

    useEffect(() => {
        const validateMeter = async () => {
            if (meterNumber?.length === 11 && provider) {
                setIsValidating(true);
                setCustomerDetails(null); // Reset previous details
                try {
                    // Find the provider and get the correct service_id based on meter type
                    const selectedProvider = providers.find((p) => p.id === provider);
                    const serviceId = meterType === "postpaid" ? selectedProvider?.postpaidId : selectedProvider?.prepaidId;

                    const payload = {
                        service_id: serviceId,
                        customerAccountId: meterNumber,
                    };

                    const response = await api.post("/mobilenig/validate", payload);
                    // Handle response structure: { details: { customerName: "..." } }
                    const data = response.data.details || response.data;
                    setCustomerDetails(data);
                    toast.success("Meter verified successfully!");
                } catch (error: any) {
                    console.error(error);
                    const message =
                        error.response?.data?.detail || "Verification failed. Please check details.";
                    toast.error(message);
                    setCustomerDetails(null);
                } finally {
                    setIsValidating(false);
                }
            } else if (meterNumber?.length < 11) {
                setCustomerDetails(null);
            }
        };

        const debounceTimer = setTimeout(() => {
            validateMeter();
        }, 500); // Add small debounce to avoid rapid calls

        return () => clearTimeout(debounceTimer);
    }, [meterNumber, provider, meterType]);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/profile/me");
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };
        fetchUser();
    }, []);

    const onSubmit = async (data: ElectricityFormValues) => {
        if (!customerDetails) {
            toast.error("Please verify meter number first");
            return;
        }

        setIsLoading(true);
        try {
            // Find the provider and get the correct service_id based on meter type
            const selectedProvider = providers.find((p) => p.id === data.provider);
            const serviceId = data.type === "postpaid" ? selectedProvider?.postpaidId : selectedProvider?.prepaidId;

            const payload = {
                service_id: serviceId,
                amount: data.amount,
                meterNumber: data.meter_number,
                phoneNumber: data.phone_number,
                email: user?.email || "techio.com.ng@gmail.com", // Fallback or handle missing email
                customerName: customerDetails.customerName || "Customer",
                customerAddress: customerDetails.address || "Address",
                customerAccountType: data.type === "postpaid" ? "Postpaid" : "Prepaid",
                customerDtNumber: customerDetails.customerDtNumber || "string",
                contactType: "TENANT",
                admin_amount: 500,
            };

            const response = await api.post("/mobilenig/purchase/electricity", payload);
            toast.success("Electricity payment successful!");

            // Handle success response
            const responseData = response.data;
            if (responseData.details && responseData.details.details) {
                setPurchaseSuccess(responseData.details.details);
            }

            // Reset form but keep success message visible
            setCustomerDetails(null);
            // setSelectedProvider(""); // Keep provider selected? Maybe better to reset everything if they want to do another
            // setValue("provider", "");
            // setValue("meter_number", "");
            // setValue("amount", 0);
        } catch (error: any) {
            console.error(error);
            let message = "Transaction failed. Please try again.";
            if (error.response?.data?.detail) {
                if (typeof error.response.data.detail === "string") {
                    message = error.response.data.detail;
                } else {
                    message = JSON.stringify(error.response.data.detail);
                }
            }
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPurchaseSuccess(null);
        setCustomerDetails(null);
        setSelectedProvider("");
        setValue("provider", "");
        setValue("meter_number", "");
        setValue("amount", 0);
        setValue("phone_number", "");
    };

    const handleProviderSelect = (providerId: string) => {
        setSelectedProvider(providerId);
        setValue("provider", providerId);
        setCustomerDetails(null); // Reset validation when provider changes
        setPurchaseSuccess(null);
    };

    if (purchaseSuccess) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        Payment Successful
                    </h1>
                    <p className="text-gray-500 mt-2">Your electricity token has been generated</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-sm text-green-600 font-medium mb-2">Token Number</p>
                        <h2 className="text-3xl font-mono font-bold text-green-700 tracking-wider">
                            {purchaseSuccess.creditToken}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-500">Meter Number</span>
                            <span className="font-medium">{purchaseSuccess.meterNumber}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-500">Amount</span>
                            <span className="font-medium">₦{purchaseSuccess.amount}</span>
                        </div>
                        {purchaseSuccess.units && (
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Units</span>
                                <span className="font-medium">{purchaseSuccess.units}</span>
                            </div>
                        )}
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-500">Reference</span>
                            <span className="font-medium text-xs text-gray-400">{purchaseSuccess.exchangeReference}</span>
                        </div>
                    </div>

                    <Button onClick={handleReset} className="w-full" size="lg">
                        Buy Another Token
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                    Pay Electricity Bill
                </h1>
                <p className="text-gray-500 mt-2">Prepaid and Postpaid payments</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Provider Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            Select Provider
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {providers.map((provider) => (
                                <button
                                    key={provider.id}
                                    type="button"
                                    onClick={() => handleProviderSelect(provider.id)}
                                    className={cn(
                                        "h-16 rounded-xl border-2 flex items-center justify-center text-xs font-semibold transition-all duration-200 px-2 text-center",
                                        selectedProvider === provider.id
                                            ? "border-primary bg-blue-50 text-primary"
                                            : "border-gray-100 hover:border-gray-200 text-gray-600"
                                    )}
                                >
                                    {provider.name}
                                </button>
                            ))}
                        </div>
                        {errors.provider && (
                            <p className="text-sm text-red-500">{errors.provider.message}</p>
                        )}
                    </div>

                    {/* Meter Type */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            Meter Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="prepaid"
                                    {...register("type")}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span>Prepaid</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="postpaid"
                                    {...register("type")}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span>Postpaid</span>
                            </label>
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            id="meter_number"
                            label="Meter Number"
                            placeholder="12345678901"
                            maxLength={11}
                            error={errors.meter_number?.message}
                            {...register("meter_number")}
                        />
                        {isValidating && (
                            <div className="absolute right-3 top-[38px]">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        )}
                    </div>

                    {/* Customer Details Card */}
                    {customerDetails && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 mb-3 text-blue-700 font-semibold">
                                <User className="w-5 h-5" />
                                Customer Details
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium uppercase">{customerDetails.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Meter Number:</span>
                                    <span className="font-medium">{customerDetails.customerNumber}</span>
                                </div>
                                {customerDetails.address && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Address:</span>
                                        <span className="font-medium text-right max-w-[200px] truncate">
                                            {customerDetails.address}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {customerDetails && (
                        <>
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
                                placeholder="1000"
                                error={errors.amount?.message}
                                {...register("amount")}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Pay Bill
                            </Button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
