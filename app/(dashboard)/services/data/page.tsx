"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Wifi, Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const networks = [
    { id: "MTN", name: "MTN", color: "bg-yellow-400", textColor: "text-yellow-900" },
    { id: "AIRTEL", name: "Airtel", color: "bg-red-500", textColor: "text-white" },
    { id: "GLO", name: "Glo", color: "bg-green-500", textColor: "text-white" },
    { id: "9MOBILE", name: "9mobile", color: "bg-green-800", textColor: "text-white" },
];

const planTypes = [
    { id: "SME", name: "SME Data" },
    { id: "CORPORATE", name: "Corporate Gifting" },
    { id: "GIFTING", name: "Direct Gifting" },
];

// Comprehensive Plan Data
const allPlans: Record<string, Record<string, { id: string; name: string; amount: number; originalAmount: number }[]>> = {
    MTN: {
        SME: [
            { id: "MBMS500", name: "500MB Mtn SME Data - 7days Validity", amount: 471, originalAmount: 428 },
            { id: "MBMS1", name: "1GB Mtn SME Data - 7days Validity", amount: 666, originalAmount: 605 },
            { id: "MBMS2", name: "2GB Mtn SME Data - 7days Validity", amount: 1330, originalAmount: 1209 },
            { id: "MBMS3", name: "3GB Mtn SME Data - 20days Validity", amount: 1881, originalAmount: 1710 },
            { id: "MBMS5", name: "5GB Mtn SME Data - 20days Validity", amount: 2849, originalAmount: 2590 },
        ],
        CORPORATE: [
            { id: "MBMC1", name: "1GB Mtn Data - 30days Validity", amount: 825, originalAmount: 750 },
            { id: "MBMC015", name: "1.5GB Mtn Data - 30days Validity", amount: 1238, originalAmount: 1125 },
            { id: "MBMC2", name: "2GB Mtn Data - 30days Validity", amount: 1617, originalAmount: 1470 },
        ],
        GIFTING: [
            { id: "MBMGD200", name: "230MB Daily Plan (Awoof Data) - 1day Validity", amount: 216, originalAmount: 196 },
            { id: "MBMGD1", name: "1GB Daily Plan + 1.5 minutes (Awoof Data) - 1day Validity", amount: 539, originalAmount: 490 },
            { id: "MBMG2D15", name: "1.5GB 2-Day Plan (Awoof Data) - 2days Validity", amount: 647, originalAmount: 588 },
            { id: "MBMG2D2", name: "2GB 2-Day Plan (Awoof Data) - 2days Validity", amount: 809, originalAmount: 735 },
            { id: "MBMG2D025", name: "2.5GB 2-Day Plan (Awoof Data) - 2days Validity", amount: 970, originalAmount: 882 },
            { id: "MBMG2D032", name: "3.2GB 2-Day Plan (Awoof Data) - 2days Validity", amount: 1078, originalAmount: 980 },
            { id: "MBMG7D1", name: "1GB Weekly Plan (Direct Data) - 7days Validity", amount: 862, originalAmount: 784 },
            { id: "MBMG7D33", name: "3.5GB Weekly Plan (Direct Data) - 7days Validity", amount: 1617, originalAmount: 1470 },
            { id: "MBMG7D5", name: "6GB Weekly Plan (Direct Data) - 7days Validity", amount: 2695, originalAmount: 2450 },
            { id: "MBMG7D7", name: "11GB Weekly Plan (Direct Data) - 7days Validity", amount: 3773, originalAmount: 3430 },
            { id: "MBMG30D35", name: "3.5GB Monthly Plan (Direct Data) - 30days Validity", amount: 2695, originalAmount: 2450 },
            { id: "MBMG30D055", name: "7GB Monthly Plan (Direct Data) - 30days Validity", amount: 3773, originalAmount: 3430 },
            { id: "MBMG30D1", name: "12.5GB Monthly Plan (Direct Data) - 30days Validity", amount: 5929, originalAmount: 5390 },
            { id: "MBMG30D15", name: "16.5GB Monthly Plan (Direct Data) - 30days Validity", amount: 7007, originalAmount: 6370 },
            { id: "MBMG30D20", name: "20GB Monthly Plan (Direct Data) - 30days Validity", amount: 8085, originalAmount: 7350 },
            { id: "MBMG30D25", name: "25GB Monthly Plan (Direct Data) - 30days Validity", amount: 9702, originalAmount: 8820 },
            { id: "MBMG30D32", name: "36GB Monthly Plan (Direct Data) - 30days Validity", amount: 11858, originalAmount: 10780 },
            { id: "MBMG30D75", name: "75GB Monthly Plan (Direct Data) - 30days Validity", amount: 19404, originalAmount: 17640 },
            { id: "MBMG30D150", name: "165GB Monthly Plan (Direct Data) - 30days Validity", amount: 37730, originalAmount: 34300 },
        ],
    },
    AIRTEL: {
        SME: [
            { id: "MBAS100", name: "100MB Airtel Data - 7days Validity", amount: 113, originalAmount: 103 },
            { id: "MBAS300", name: "300MB Airtel Data - 7days Validity", amount: 331, originalAmount: 301 },
            { id: "MBAS500", name: "500MB Airtel Data - 30days Validity", amount: 549, originalAmount: 499 },
            { id: "MBAS1", name: "1GB Airtel Data - 30days Validity", amount: 1100, originalAmount: 1000 },
        ],
        GIFTING: [
            { id: "MBAG500", name: "500MB - 7 days (Direct Data)", amount: 536, originalAmount: 487 },
            { id: "MBAG15", name: "1.5GB - 7 days (Direct Data)", amount: 1073, originalAmount: 975 },
            { id: "MBAG35", name: "3.5GB - 7 days (Direct Data)", amount: 1608, originalAmount: 1462 },
            { id: "MBAG6", name: "6GB - 7 days (Direct Data)", amount: 2681, originalAmount: 2437 },
            { id: "MBAG10", name: "10GB - 7 days (Direct Data)", amount: 3218, originalAmount: 2925 },
            { id: "MBAG18", name: "18GB - 7 days (Direct Data)", amount: 5361, originalAmount: 4874 },
            { id: "MBAG2", name: "2GB - 30 days (Direct Data)", amount: 1608, originalAmount: 1462 },
            { id: "MBAG3", name: "3GB - 30 days (Direct Data)", amount: 2145, originalAmount: 1950 },
            { id: "MBAG4", name: "4GB - 30 days (Direct Data)", amount: 2681, originalAmount: 2437 },
            { id: "MBAG8", name: "8GB - 30 days (Direct Data)", amount: 3218, originalAmount: 2925 },
            { id: "MBAG010", name: "10GB - 30 days (Direct Data)", amount: 4290, originalAmount: 3900 },
            { id: "MBAG13", name: "13GB - 30 days (Direct Data)", amount: 5361, originalAmount: 4874 },
            { id: "MBAG018", name: "18GB - 30 days (Direct Data)", amount: 6434, originalAmount: 5849 },
            { id: "MBAG25", name: "25GB - 30 days (Direct Data)", amount: 8579, originalAmount: 7799 },
            { id: "MBAG35", name: "35GB - 30 days (Direct Data)", amount: 10724, originalAmount: 9749 },
            { id: "MBAG60", name: "60GB - 30 days (Direct Data)", amount: 16085, originalAmount: 14623 },
            { id: "MBAG100", name: "100GB - 30 days (Direct Data)", amount: 21448, originalAmount: 19498 },
            { id: "MBAG160", name: "160GB - 30 days (Direct Data)", amount: 32172, originalAmount: 29247 },
            { id: "MBAG210", name: "210GB - 30 days (Direct Data)", amount: 42896, originalAmount: 38996 },
            { id: "MBAG300", name: "300GB - 90 days (Direct Data)", amount: 53620, originalAmount: 48745 },
            { id: "MBAG350", name: "350GB - 120 days (Direct Data)", amount: 64342, originalAmount: 58493 },
        ],
    },
    GLO: {
        GIFTING: [
            { id: "MBGG200", name: "200MB Glo Data - 14days Validity", amount: 108, originalAmount: 98 },
            { id: "MBGG500", name: "500MB Glo Data - 30days Validity", amount: 263, originalAmount: 239 },
            { id: "MBGG3D1", name: "1GB Glo Data - 3days Validity", amount: 321, originalAmount: 292 },
            { id: "MBGG3D3", name: "3GB Glo Data - 3days Validity", amount: 964, originalAmount: 876 },
            { id: "MBGG3D5", name: "5GB Glo Data - 3days Validity", amount: 1606, originalAmount: 1460 },
            { id: "MBGG7D1", name: "1GB Glo Data - 7days Validity", amount: 373, originalAmount: 339 },
            { id: "MBGG7D3", name: "3GB Glo Data - 7days Validity", amount: 1119, originalAmount: 1017 },
            { id: "MBGG7D5", name: "5GB Glo Data - 7days Validity", amount: 1865, originalAmount: 1695 },
            { id: "MBGG14DNP1", name: "1GB Glo Data - 14days Night Plan", amount: 373, originalAmount: 339 },
            { id: "MBGG14DNP3", name: "3GB Glo Data - 14days Night Plan", amount: 1119, originalAmount: 1017 },
            { id: "MBGG14DNP5", name: "5GB Glo Data - 14days Night Plan", amount: 1865, originalAmount: 1695 },
            { id: "MBGG14DNP10", name: "10GB Glo Data - 14days Night Plan", amount: 3729, originalAmount: 3390 },
            { id: "MBGG1", name: "1GB Glo Data - 30days Validity", amount: 528, originalAmount: 480 },
            { id: "MBGG2", name: "2GB Glo Data - 30days Validity", amount: 1056, originalAmount: 960 },
            { id: "MBGG3", name: "3GB Glo Data - 30days Validity", amount: 1584, originalAmount: 1440 },
            { id: "MBGG5", name: "5GB Glo Data - 30days Validity", amount: 2640, originalAmount: 2400 },
            { id: "MBGG10", name: "10GB Glo Data - 30days Validity", amount: 5280, originalAmount: 4800 },
        ],
    },
    "9MOBILE": {
        SME: [
            { id: "MBMS300", name: "300MB 9mobile Data - 30days Validity", amount: 51, originalAmount: 46 },
            { id: "MBMS500", name: "500MB 9mobile Data - 30days Validity", amount: 87, originalAmount: 79 },
            { id: "MBMS1", name: "1GB 9mobile Data - 30days Validity", amount: 154, originalAmount: 140 },
            { id: "MBMS2", name: "2GB 9mobile Data - 30days Validity", amount: 308, originalAmount: 280 },
            { id: "MBMS3", name: "3GB 9mobile Data - 30days Validity", amount: 462, originalAmount: 420 },
            { id: "MBMS4", name: "4GB 9mobile Data - 30days Validity", amount: 616, originalAmount: 560 },
            { id: "MBMS5", name: "5GB 9mobile Data - 30days Validity", amount: 770, originalAmount: 700 },
            { id: "MBMS10", name: "10GB 9mobile Data - 30days Validity", amount: 1540, originalAmount: 1400 },
            { id: "MBMS15", name: "15GB 9mobile Data - 30days Validity", amount: 2310, originalAmount: 2100 },
            { id: "MBMS20", name: "20GB 9mobile Data - 30days Validity", amount: 3080, originalAmount: 2800 },
            { id: "MBMS25", name: "25GB 9mobile Data - 30days Validity", amount: 3850, originalAmount: 3500 },
        ],
        GIFTING: [
            { id: "MBES250", name: "250MB - 1day Validity", amount: 216, originalAmount: 196 },
            { id: "MBES650", name: "650MB+100MB Social - 7days Validity", amount: 539, originalAmount: 490 },
            { id: "MBES34", name: "3.4GB - 7days Validity", amount: 2310, originalAmount: 2100 },
            { id: "MBES2", name: "2GB - 30days Validity", amount: 1540, originalAmount: 1400 },
            { id: "MBES23", name: "2.3GB - 30days Validity", amount: 1848, originalAmount: 1680 },
            { id: "MBES45", name: "4.5GB - 30days Validity", amount: 3080, originalAmount: 2800 },
            { id: "MBES52", name: "5.2GB - 30days Validity", amount: 3850, originalAmount: 3500 },
            { id: "MBES62", name: "6.2GB - 30days Validity", amount: 4620, originalAmount: 4200 },
            { id: "MBES84", name: "8.4GB - 30days Validity", amount: 6160, originalAmount: 5600 },
            { id: "MBES114", name: "11.4GB - 30days Validity", amount: 7700, originalAmount: 7000 },
        ],
    },
};

const dataSchema = z.object({
    network: z.string().min(1, "Please select a network"),
    plan_type: z.string().min(1, "Please select a plan type"),
    phone_number: z.string().length(11, "Phone number must be 11 digits"),
    plan_id: z.string().min(1, "Please select a plan"),
    amount: z.number(),
});

type DataFormValues = z.infer<typeof dataSchema>;

export default function DataPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState("");
    const [selectedPlanType, setSelectedPlanType] = useState("");
    const [availablePlans, setAvailablePlans] = useState<{ id: string; name: string; amount: number; originalAmount: number }[]>([]);
    const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<DataFormValues>({
        resolver: zodResolver(dataSchema),
    });

    const selectedPlanId = watch("plan_id");

    useEffect(() => {
        if (selectedNetwork && selectedPlanType) {
            const networkPlans = allPlans[selectedNetwork];
            if (networkPlans) {
                setAvailablePlans(networkPlans[selectedPlanType] || []);
            } else {
                setAvailablePlans([]);
            }
            setValue("plan_id", ""); // Reset plan when network/type changes
        } else {
            setAvailablePlans([]);
        }
    }, [selectedNetwork, selectedPlanType, setValue]);

    useEffect(() => {
        const plan = availablePlans.find((p) => p.id === selectedPlanId);
        if (plan) {
            setValue("amount", plan.amount);
        }
    }, [selectedPlanId, availablePlans, setValue]);

    const onSubmit = async (data: DataFormValues) => {
        setIsLoading(true);
        try {
            // Map network to specific service_id
            const serviceIdMap: Record<string, string> = {
                MTN: "BCA",
                "9MOBILE": "BCB",
                GLO: "BCC",
                AIRTEL: "BCD",
            };

            const serviceId = serviceIdMap[data.network] || "";
            const plan = availablePlans.find((p) => p.id === data.plan_id);

            const payload = {
                service_id: serviceId,
                service_type: data.plan_type, // "SME", "GIFTING", or "CORPORATE"
                amount: plan?.originalAmount,
                customerPhoneNumber: data.phone_number,
                productCode: data.plan_id,
                admin_amount: data.amount,
            };

            const response = await api.post("/mobilenig/purchase/data", payload);
            setPurchaseSuccess({ ...response.data, paidAmount: data.amount });
            toast.success("Data purchase successful!");
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
        setSelectedPlanType(""); // Reset plan type
        setValue("plan_type", "");
    };

    const handleReset = () => {
        setPurchaseSuccess(null);
        setSelectedNetwork("");
        setSelectedPlanType("");
        setValue("network", "");
        setValue("plan_type", "");
        setValue("plan_id", "");
        setValue("phone_number", "");
        setValue("amount", 0);
    };

    if (purchaseSuccess) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        Purchase Successful
                    </h1>
                    <p className="text-gray-500 mt-2">Your data bundle has been sent.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                        <h2 className="text-3xl font-mono font-bold text-green-700 tracking-wider">
                            ₦{purchaseSuccess.paidAmount?.toLocaleString()}
                        </h2>
                    </div>
                    <Button onClick={handleReset} className="w-full" size="lg">
                        Buy More Data
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Wifi className="w-6 h-6 text-blue-600" />
                    </div>
                    Buy Data Bundle
                </h1>
                <p className="text-gray-500 mt-2">Cheap data plans for all devices</p>
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
                                            ? `border-transparent ring-2 ring-offset-2 ring-blue-500 ${network.color} ${network.textColor}`
                                            : "border-gray-100 hover:border-gray-200 text-gray-600 bg-gray-50"
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

                    {/* Plan Type Selection */}
                    {selectedNetwork && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium text-gray-700">
                                Select Plan Type
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {planTypes
                                    .filter(type => allPlans[selectedNetwork]?.[type.id])
                                    .map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedPlanType(type.id);
                                                setValue("plan_type", type.id);
                                            }}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                                                selectedPlanType === type.id
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                            )}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                            </div>
                            {errors.plan_type && (
                                <p className="text-sm text-red-500">{errors.plan_type.message}</p>
                            )}
                        </div>
                    )}

                    {/* Plan Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Select Plan
                        </label>
                        <select
                            className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            {...register("plan_id")}
                            disabled={!selectedNetwork || !selectedPlanType}
                        >
                            <option value="">
                                {!selectedNetwork
                                    ? "Select a network first"
                                    : !selectedPlanType
                                        ? "Select a plan type first"
                                        : "Select a data plan"}
                            </option>
                            {availablePlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - ₦{plan.amount}
                                </option>
                            ))}
                        </select>
                        {errors.plan_id && (
                            <p className="text-sm text-red-500">{errors.plan_id.message}</p>
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
                        placeholder="0.00"
                        readOnly
                        className="bg-gray-50 font-semibold text-gray-900"
                        {...register("amount")}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                        disabled={!selectedNetwork || !selectedPlanType || !selectedPlanId}
                    >
                        Purchase Data
                    </Button>
                </form>
            </div>
        </div>
    );
}
