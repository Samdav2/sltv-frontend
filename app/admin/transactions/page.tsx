"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ArrowUpRight,
    ArrowDownLeft,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    reference: string;
    service_type: string | null;
    created_at: string;
    wallet_id: string;
}

export default function AdminTransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const skip = (page - 1) * limit;
                const response = await api.get(`/admin/transactions?skip=${skip}&limit=${limit}`);

                let transactionsData: Transaction[] = [];
                if (Array.isArray(response.data)) {
                    transactionsData = response.data;
                } else if (response.data && Array.isArray(response.data.items)) {
                    transactionsData = response.data.items;
                } else if (response.data && Array.isArray(response.data.transactions)) {
                    transactionsData = response.data.transactions;
                }

                setTransactions(transactionsData);

                if (transactionsData.length < limit) {
                    setTotalPages(page);
                } else {
                    setTotalPages(page + 1);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [page]);

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch =
            t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.service_type && t.service_type.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === "all" || t.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <p className="text-sm text-gray-500">Monitor all system transactions</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by reference or service..."
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Reference / Service</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{t.reference}</span>
                                                <span className="text-xs text-gray-500 capitalize">{t.service_type || "Wallet Funding"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.type === 'credit' ? (
                                                <span className="inline-flex items-center text-green-600 text-xs font-medium">
                                                    <ArrowDownLeft className="w-3 h-3 mr-1" />
                                                    Credit
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-red-600 text-xs font-medium">
                                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                                    Debit
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ₦{t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                                t.status === "success" ? "bg-green-100 text-green-800" :
                                                    t.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                            )}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(new Date(t.created_at), "MMM d, yyyy HH:mm")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                                onClick={() => router.push(`/admin/transactions/${t.id}`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing page {page}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={filteredTransactions.length < limit}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
