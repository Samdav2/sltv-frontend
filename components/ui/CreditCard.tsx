import { cn } from "@/lib/utils";

interface CreditCardProps {
    balance: number;
    currency?: string;
    cardHolder: string;
    expiryDate: string;
    cardNumber: string;
    variant?: "blue" | "white";
}

export function CreditCard({
    balance,
    currency = "₦",
    cardHolder,
    expiryDate,
    cardNumber,
    variant = "blue",
}: CreditCardProps) {
    const isBlue = variant === "blue";

    return (
        <div
            className={cn(
                "relative w-full aspect-[1.586] rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02]",
                isBlue
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl shadow-blue-500/20"
                    : "bg-white text-gray-900 border border-gray-100 shadow-sm"
            )}
        >
            {/* Background decoration */}
            {isBlue && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
            )}

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className={cn("text-xs font-medium mb-1", isBlue ? "text-blue-100" : "text-gray-500")}>
                        Wallet Balance
                    </p>
                    <h3 className="text-3xl font-bold">
                        {currency}{balance.toLocaleString()}
                    </h3>
                </div>
                <div className={cn("p-2 rounded-lg", isBlue ? "bg-white/10" : "bg-gray-100")}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn("w-6 h-6", isBlue ? "text-white" : "text-gray-900")}
                    >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <div className="flex justify-between items-end">
                    <div>
                        <p className={cn("text-[10px] uppercase tracking-wider mb-1", isBlue ? "text-blue-200" : "text-gray-400")}>
                            Account Holder
                        </p>
                        <p className="font-medium text-lg truncate">{cardHolder}</p>
                    </div>
                    <div className="text-right">
                        <p className={cn("text-[10px] uppercase tracking-wider mb-1", isBlue ? "text-blue-200" : "text-gray-400")}>
                            Status
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="font-medium text-sm">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
