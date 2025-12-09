"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Headset, Plus, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket } from "@/types";
import { cn } from "@/lib/utils";

const ticketSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    priority: z.enum(["low", "medium", "high"]),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

import { useQuery, useQueryClient } from "@tanstack/react-query";

// ... (imports)

export default function SupportPage() {
    const [isCreating, setIsCreating] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TicketFormValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            priority: "medium",
        },
    });

    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ["user-tickets"],
        queryFn: async () => {
            const response = await api.get("/support/");
            return response.data;
        },
    });

    const onSubmit = async (data: TicketFormValues) => {
        setIsCreating(true);
        try {
            await api.post("/support/", data);
            toast.success("Ticket created successfully!");
            reset();
            queryClient.invalidateQueries({ queryKey: ["user-tickets"] });
        } catch (error: any) {
            console.error(error);
            const message =
                error.response?.data?.detail || "Failed to create ticket.";
            toast.error(message);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Headset className="w-6 h-6 text-blue-600" />
                    </div>
                    Support Center
                </h1>
                <p className="text-gray-500 mt-2">We are here to help you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Ticket Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Create New Ticket
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="subject"
                                label="Subject"
                                placeholder="Issue with payment"
                                error={errors.subject?.message}
                                {...register("subject")}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Priority
                                </label>
                                <select
                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    {...register("priority")}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    placeholder="Describe your issue..."
                                    {...register("message")}
                                ></textarea>
                                {errors.message && (
                                    <p className="text-sm text-red-500">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isCreating}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Create Ticket
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Ticket List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Your Tickets</h3>
                        </div>
                        {isLoading ? (
                            <div className="p-12 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No tickets found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => window.location.href = `/support/${ticket.id}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {ticket.subject}
                                            </h4>
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                                    ticket.status === "open"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                )}
                                            >
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>
                                                Priority:{" "}
                                                <span
                                                    className={cn(
                                                        "capitalize font-medium",
                                                        ticket.priority === "high"
                                                            ? "text-red-500"
                                                            : ticket.priority === "medium"
                                                                ? "text-yellow-500"
                                                                : "text-green-500"
                                                    )}
                                                >
                                                    {ticket.priority}
                                                </span>
                                            </span>
                                            <span>
                                                {format(new Date(ticket.created_at), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
