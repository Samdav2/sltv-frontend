"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get("reference") || searchParams.get("trxref");

            if (!reference) {
                setStatus("error");
                setMessage("No payment reference found.");
                return;
            }

            try {
                // Attempt to verify the transaction
                // Endpoint: GET /wallet/fund/paystack/verify?reference={reference}
                await api.get(`/wallet/fund/paystack/verify?reference=${reference}`);

                setStatus("success");
                setMessage("Payment successful! Your wallet has been funded.");
                toast.success("Wallet funded successfully!");

                // Refresh the page or redirect after a delay to update balance
                setTimeout(() => {
                    router.push("/dashboard");
                    router.refresh();
                }, 3000);

            } catch (error: any) {
                console.error("Payment verification failed:", error);
                setStatus("error");
                const errorDetail = error.response?.data?.detail || error.message || "Unknown error";
                setMessage(
                    `Verification failed: ${errorDetail}. Ref: ${reference}`
                );
                toast.error("Payment verification failed");
            }
        };

        verifyPayment();
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            {status === "loading" && (
                <>
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Verifying Payment</h2>
                    <p className="text-gray-500 mt-2">{message}</p>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
                    <p className="text-gray-500 mt-2 mb-6">{message}</p>
                    <Button onClick={() => router.push("/dashboard")}>
                        Go to Dashboard
                    </Button>
                </>
            )}

            {status === "error" && (
                <>
                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                    <p className="text-gray-500 mt-2 mb-6">{message}</p>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.push("/fund-wallet")}>
                            Try Again
                        </Button>
                        <Button onClick={() => router.push("/support")}>
                            Contact Support
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <PaymentCallbackContent />
        </Suspense>
    );
}
