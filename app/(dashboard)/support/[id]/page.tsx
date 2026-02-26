import UserTicketDetailsClient from "./client";

export default async function UserTicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UserTicketDetailsClient ticketId={id} />;
}
