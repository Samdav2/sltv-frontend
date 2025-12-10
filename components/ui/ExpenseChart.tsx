"use client";

import { cn } from "@/lib/utils";

interface ExpenseChartProps {
    data: { label: string; value: number; active?: boolean }[];
    total: number;
}

export function ExpenseChart({ data, total }: ExpenseChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="bg-white rounded-3xl p-6 h-full flex flex-col border border-gray-100 shadow-sm">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <p className="text-sm text-gray-500 mb-1">My Expense</p>
                    <h3 className="text-2xl font-bold text-gray-900">₦{total.toLocaleString()}</h3>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4">
                {data.map((item, index) => {
                    const heightPercentage = (item.value / maxValue) * 100;
                    return (
                        <div key={index} className="flex flex-col items-center gap-3 group w-full">
                            <div className="relative w-full h-32 sm:h-40 flex items-end justify-center rounded-xl bg-gray-50 overflow-hidden">
                                <div
                                    className={cn(
                                        "w-full mx-1 sm:mx-2 rounded-t-lg transition-all duration-500 ease-out",
                                        item.active
                                            ? "bg-primary shadow-lg shadow-primary/25"
                                            : "bg-gray-200 group-hover:bg-gray-300"
                                    )}
                                    style={{ height: `${heightPercentage}%` }}
                                />
                            </div>
                            <span className={cn(
                                "text-xs font-medium",
                                item.active ? "text-primary" : "text-gray-400"
                            )}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
