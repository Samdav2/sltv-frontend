"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Save,
    Loader2,
    Tag,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ServicePrice {
    id?: string;
    service_identifier: string;
    profit_type: "fixed" | "percentage";
    profit_value: number;
}

export default function AdminServicesPage() {
    const [prices, setPrices] = useState<ServicePrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editingPrice, setEditingPrice] = useState<ServicePrice | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchPrices = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/price/");

            let pricesData: ServicePrice[] = [];
            if (Array.isArray(response.data)) {
                pricesData = response.data;
            } else if (response.data && Array.isArray(response.data.items)) {
                pricesData = response.data.items;
            } else if (response.data && Array.isArray(response.data.prices)) {
                pricesData = response.data.prices;
            }

            setPrices(pricesData);
        } catch (error) {
            console.error("Failed to fetch prices", error);
            toast.error("Failed to fetch service prices");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const handleSave = async (price: ServicePrice) => {
        setIsSaving(true);
        try {
            await api.post("/price/", price);
            toast.success("Service price updated successfully");
            setIsDialogOpen(false);
            fetchPrices();
        } catch (error: any) {
            console.error("Failed to update price", error);
            toast.error(error.response?.data?.detail || "Failed to update price");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredPrices = prices.filter(p =>
        p.service_identifier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Prices</h1>
                    <p className="text-sm text-gray-500">Manage profit margins for services</p>
                </div>
                <Button onClick={() => {
                    setEditingPrice({
                        service_identifier: "",
                        profit_type: "fixed",
                        profit_value: 0
                    });
                    setIsDialogOpen(true);
                }} className="bg-red-600 hover:bg-red-700 text-white">
                    <Tag className="w-4 h-4 mr-2" />
                    Add New Price Config
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by service identifier..."
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Prices Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : filteredPrices.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No prices configured</h3>
                    <p className="text-gray-500 mt-1">Add a new price configuration to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrices.map((price) => (
                        <Card key={price.id || price.service_identifier} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-2">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-blue-600"
                                        onClick={() => {
                                            setEditingPrice(price);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-900 break-all">
                                    {price.service_identifier}
                                </CardTitle>
                                <CardDescription>
                                    Profit Configuration
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-500 capitalize">
                                        {price.profit_type} Profit
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {price.profit_type === "fixed" ? "₦" : ""}
                                        {price.profit_value}
                                        {price.profit_type === "percentage" ? "%" : ""}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingPrice?.id ? "Edit Price Configuration" : "New Price Configuration"}
                        </DialogTitle>
                        <DialogDescription>
                            Configure profit margins for a specific service identifier.
                        </DialogDescription>
                    </DialogHeader>

                    {editingPrice && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Service Identifier</label>
                                <Input
                                    value={editingPrice.service_identifier}
                                    onChange={(e) => setEditingPrice({ ...editingPrice, service_identifier: e.target.value })}
                                    placeholder="e.g., mtn-data-1gb"
                                    disabled={!!editingPrice.id} // Disable editing ID for existing
                                />
                                {editingPrice.id && (
                                    <p className="text-xs text-yellow-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Identifier cannot be changed once created
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Profit Type</label>
                                    <Select
                                        value={editingPrice.profit_type}
                                        onValueChange={(value: "fixed" | "percentage") =>
                                            setEditingPrice({ ...editingPrice, profit_type: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Profit Value</label>
                                    <Input
                                        type="number"
                                        value={editingPrice.profit_value}
                                        onChange={(e) => setEditingPrice({ ...editingPrice, profit_value: parseFloat(e.target.value) })}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => editingPrice && handleSave(editingPrice)}
                            disabled={isSaving || !editingPrice?.service_identifier}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Configuration
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
