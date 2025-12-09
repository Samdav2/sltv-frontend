import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generateTransactionReceipt = (transaction: any, user: any) => {
    const doc = new jsPDF();

    // Brand Colors
    const primaryColor = '#DC2626'; // Red-600
    const secondaryColor = '#111827'; // Gray-900
    const lightGray = '#F3F4F6'; // Gray-100

    // --- Page Border ---
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); // A4 size is 210x297, so 10mm margin

    // --- Header Section ---
    // Background for header (within border)
    doc.setFillColor(primaryColor);
    doc.rect(10, 10, 190, 40, 'F');

    // Logo / Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('SLTV', 25, 38);

    // Receipt Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('TRANSACTION RECEIPT', 185, 38, { align: 'right' });

    // --- Transaction Status & Amount ---
    doc.setTextColor(secondaryColor);

    // Status Badge
    const statusColor = transaction.status === 'success' ? '#059669' : '#DC2626';
    doc.setDrawColor(statusColor);
    doc.setFillColor(statusColor);
    doc.roundedRect(25, 65, 25, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(transaction.status.toUpperCase(), 37.5, 70, { align: 'center' });

    // Amount (Using NGN ISO code for better compatibility)
    doc.setTextColor(secondaryColor);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    const amountPrefix = transaction.type === 'credit' ? '+' : '-';
    doc.text(`${amountPrefix} NGN ${transaction.amount.toLocaleString()}`, 25, 85);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(format(new Date(transaction.created_at), "MMMM d, yyyy 'at' h:mm a"), 25, 92);

    // --- Details Table ---
    const tableData = [
        ['Transaction Reference', transaction.reference || 'N/A'],
        ['Transaction Type', transaction.type === 'credit' ? 'Wallet Deposit' : 'Service Payment'],
        ['Description', transaction.description],
        ['Payment Method', 'Wallet Balance'],
        ['User Name', user?.full_name || 'N/A'],
        ['User Email', user?.email || 'N/A'],
    ];

    autoTable(doc, {
        startY: 105,
        margin: { left: 25, right: 25 },
        head: [],
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 10,
            textColor: secondaryColor,
            lineColor: [229, 231, 235],
            lineWidth: 0.1,
        },
        columnStyles: {
            0: {
                fontStyle: 'bold',
                cellWidth: 60,
                fillColor: [249, 250, 251],
                textColor: [55, 65, 81]
            },
            1: {
                cellWidth: 'auto',
                fontStyle: 'normal'
            },
        },
    });

    // --- Footer ---
    const finalY = (doc as any).lastAutoTable.finalY + 30;

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(25, finalY, 185, finalY);

    // Support Info
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Authorized Transaction', 105, finalY + 10, { align: 'center' });
    doc.text('Thank you for choosing SLTV.', 105, finalY + 16, { align: 'center' });
    doc.text('Need help? Contact us at support@sltv.com', 105, finalY + 22, { align: 'center' });

    // Save
    doc.save(`SLTV-Receipt-${transaction.reference || 'transaction'}.pdf`);
};
