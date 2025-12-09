"use client";

import { useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaystackPaymentProps {
    config: {
        publicKey: string;
        reference: string;
        amount: number;
        email: string;
        access_code?: string;
    };
    trigger: boolean;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    isLoading: boolean;
    setTrigger: (value: boolean) => void;
}

export default function PaystackPayment({
    config,
    trigger,
    onSuccess,
    onClose,
    isLoading,
    setTrigger,
}: PaystackPaymentProps) {
    const initializePayment = usePaystackPayment({
        ...config,
    });

    useEffect(() => {
        if (trigger && config.access_code) {
            initializePayment({ onSuccess, onClose });
            setTrigger(false);
        }
    }, [trigger, config, initializePayment, onSuccess, onClose, setTrigger]);

    return (
        <Button
            type="submit"
            className="w-full bg-[#0BA4DB] hover:bg-[#0a93c4]"
            size="lg"
            isLoading={isLoading}
        >
            <CreditCard className="w-4 h-4 mr-2" /> Pay with Paystack
        </Button>
    );
}
