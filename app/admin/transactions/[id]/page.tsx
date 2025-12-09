"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Calendar,
    Hash,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminTransactionDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const transactionId = params.id as string;
    const [transaction, setTransaction] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await api.get(`/admin/transactions/${transactionId}`);
                const transactionData = response.data.transaction || response.data; // Handle potential wrapper
                setTransaction(transactionData);
            } catch (error) {
                console.error("Failed to fetch transaction", error);
                router.push("/admin/transactions");
            } finally {
                setIsLoading(false);
            }
        };

        if (transactionId) {
            fetchTransaction();
        }
    }, [transactionId, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (!transaction) return null;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
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
                    <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                    <p className="text-sm text-gray-500">View transaction information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Card */}
                <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center text-center py-6">
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                                transaction.status === "success" ? "bg-green-100 text-green-600" :
                                    transaction.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                                        "bg-red-100 text-red-600"
                            )}>
                                {transaction.status === "success" ? <CheckCircle2 className="w-8 h-8" /> :
                                    transaction.status === "pending" ? <Clock className="w-8 h-8" /> :
                                        <XCircle className="w-8 h-8" />}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">
                                ₦{transaction.amount.toLocaleString()}
                            </h2>
                            <p className="text-gray-500 font-medium capitalize mb-4">
                                {transaction.status} Transaction
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                <Hash className="w-4 h-4" />
                                <span className="font-mono">{transaction.reference}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Type
                            </span>
                            <span className={cn(
                                "font-medium capitalize flex items-center gap-1",
                                transaction.type === "credit" ? "text-green-600" : "text-red-600"
                            )}>
                                {transaction.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                {transaction.type}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Date
                            </span>
                            <span className="font-medium text-gray-900">
                                {format(new Date(transaction.created_at), "MMM d, yyyy HH:mm")}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Service</span>
                            <span className="font-medium text-gray-900 capitalize">
                                {transaction.service_type || "Wallet Funding"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* User Info (If available or linked) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Related Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <User className="w-4 h-4" /> Wallet ID
                            </span>
                            <span className="font-mono text-xs text-gray-900 truncate max-w-[150px]" title={transaction.wallet_id}>
                                {transaction.wallet_id}
                            </span>
                        </div>
                        {transaction.meta_data && (
                            <div className="py-2">
                                <span className="text-sm text-gray-500 block mb-2">Metadata</span>
                                <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                                    {typeof transaction.meta_data === 'string'
                                        ? transaction.meta_data
                                        : JSON.stringify(transaction.meta_data, null, 2)}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
