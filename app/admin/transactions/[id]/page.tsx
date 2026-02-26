import AdminTransactionDetailsClient from "./client";

export default async function AdminTransactionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminTransactionDetailsClient transactionId={id} />;
}
