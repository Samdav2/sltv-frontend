import AdminUserDetailsClient from "./client";

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminUserDetailsClient userId={id} />;
}
