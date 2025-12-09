"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    User,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import api from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
    id: string;
    ticket_id: string;
    sender_id: string | null;
    admin_id: string | null;
    message: string;
    is_admin: boolean;
    created_at: string;
}

interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    priority: "low" | "medium" | "high";
    status: "open" | "in_progress" | "resolved" | "closed";
    created_at: string;
    updated_at: string;
    messages: Message[];
}

export default function AdminTicketDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;
    const [replyMessage, setReplyMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const queryClient = useQueryClient();

    const { data: ticket, isLoading } = useQuery({
        queryKey: ["admin-ticket", ticketId],
        queryFn: async () => {
            // PER API DOCS: There is no specific GET /api/v1/admin/support/tickets/{id} endpoint.
            // Therefore, we fetch the list and find the specific ticket by ID.
            const response = await api.get(`/admin/support/tickets?limit=1000`);

            let tickets: Ticket[] = [];
            if (Array.isArray(response.data)) {
                tickets = response.data;
            } else if (response.data && Array.isArray(response.data.items)) {
                tickets = response.data.items;
            } else if (response.data && Array.isArray(response.data.tickets)) {
                tickets = response.data.tickets;
            }

            const foundTicket = tickets.find((t) => t.id === ticketId);
            if (!foundTicket) throw new Error("Ticket not found");
            return foundTicket;
        },
        refetchInterval: 5000,
        retry: false,
    });

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await api.put(`/admin/support/tickets/${ticketId}/status`, { status: newStatus });
            toast.success(`Ticket status updated to ${newStatus}`);
            queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update ticket status");
        }
    };

    const handlePriorityUpdate = async (newPriority: string) => {
        try {
            await api.put(`/admin/support/tickets/${ticketId}/priority`, { priority: newPriority });
            toast.success(`Ticket priority updated to ${newPriority}`);
            queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
        } catch (error) {
            console.error("Failed to update priority", error);
            toast.error("Failed to update ticket priority");
        }
    };

    const replyMutation = useMutation({
        mutationFn: async (message: string) => {
            await api.post(`/admin/support/tickets/${ticketId}/message`, { message });
        },
        onSuccess: () => {
            setReplyMessage("");
            toast.success("Reply sent successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-ticket", ticketId] });
        },
        onError: (error: any) => {
            console.error("Failed to send reply", error);
            if (error.response?.status === 404) {
                toast.error("Reply failed: Admin reply endpoint not found on backend.");
            } else {
                toast.error("Failed to send reply");
            }
        }
    });

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        replyMutation.mutate(replyMessage);
    };

    const isSending = replyMutation.isPending;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
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
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {ticket.subject}
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-medium capitalize border",
                                ticket.status === "open" ? "bg-blue-50 text-blue-700 border-blue-100" :
                                    ticket.status === "closed" ? "bg-gray-50 text-gray-700 border-gray-100" :
                                        "bg-yellow-50 text-yellow-700 border-yellow-100"
                            )}>
                                {ticket.status}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            Ticket #{ticket.id.slice(0, 8)} • Created {format(new Date(ticket.created_at), "MMM d, yyyy HH:mm")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={ticket.status} onValueChange={handleStatusUpdate}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={ticket.priority} onValueChange={handlePriorityUpdate}>
                        <SelectTrigger className={cn(
                            "w-[140px] bg-white",
                            ticket.priority === "high" ? "text-red-600 font-medium" :
                                ticket.priority === "medium" ? "text-yellow-600" :
                                    "text-green-600"
                        )}>
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {ticket.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-4 max-w-[80%]",
                                msg.is_admin ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.is_admin ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                            )}>
                                {msg.is_admin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={cn(
                                "space-y-1",
                                msg.is_admin ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "flex items-center gap-2 text-xs text-gray-500",
                                    msg.is_admin ? "flex-row-reverse" : ""
                                )}>
                                    <span className="font-medium text-gray-900">
                                        {msg.is_admin ? "Support Agent" : "User"}
                                    </span>
                                    <span>{format(new Date(msg.created_at), "HH:mm")}</span>
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    msg.is_admin
                                        ? "bg-red-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                                )}>
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleReply} className="flex gap-4">
                        <Textarea
                            placeholder="Type your reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="min-h-[80px] resize-none bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleReply(e);
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            className="h-auto px-6 bg-red-600 hover:bg-red-700 text-white"
                            disabled={!replyMessage.trim() || isSending}
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
