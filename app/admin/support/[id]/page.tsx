import AdminTicketDetailsClient from "./client";

export default async function AdminTicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminTicketDetailsClient ticketId={id} />;
}
