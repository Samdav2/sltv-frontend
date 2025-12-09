export interface User {
    id: string;
    email: string;
    full_name: string;
    phone_number?: string;
    address?: string;
    state?: string;
    lga?: string;
    nin?: string;
    bvn?: string;
}

export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    wallet_id: string;
    amount: number;
    type: "credit" | "debit";
    status: "pending" | "success" | "failed";
    description: string;
    created_at: string;
    reference: string;
}

export interface ServicePlan {
    id: string;
    name: string;
    amount: number;
    network: string;
    plan_id: string; // The ID used for the API
}

export interface Ticket {
    id: string;
    subject: string;
    priority: "low" | "medium" | "high";
    status: "open" | "closed" | "in_progress" | "resolved";
    created_at: string;
    messages: TicketMessage[];
}

export interface TicketMessage {
    id: string;
    ticket_id: string;
    sender: "user" | "support";
    message: string;
    created_at: string;
}
