import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generateTransactionReceipt = (transaction: any, user: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const doc = new jsPDF();

    // --- Configuration & Colors ---
    const brandBlue = '#2563EB'; // Blue-600
    // const brandDark = '#1E3A8A'; // Blue-900 (Unused)
    const successGreen = '#16A34A'; // Green-600
    const failureRed = '#DC2626'; // Red-600
    const textDark = '#111827'; // Gray-900
    const textLight = '#6B7280'; // Gray-500
    const white = '#FFFFFF';

    // Determine Dynamic Colors based on transaction type/status
    const isCredit = transaction.type === 'credit';
    const isSuccess = transaction.status === 'success';

    // For amount: Credit = Green, Debit = Red
    const amountColor = isCredit ? successGreen : failureRed;

    // For status badge
    const statusColor = isSuccess ? successGreen : (transaction.status === 'pending' ? '#D97706' : failureRed);

    // --- Header Section (Blue Background) ---
    doc.setFillColor(brandBlue);
    doc.rect(0, 0, 210, 50, 'F'); // Full width header

    // Logo / Brand Name
    doc.setTextColor(white);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('EZY VTU', 15, 32);

    // Receipt Label
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('TRANSACTION RECEIPT', 195, 25, { align: 'right' });

    // Receipt Number
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255, 0.8); // 80% opacity
    doc.text(`#${transaction.reference?.slice(0, 12).toUpperCase() || 'N/A'}`, 195, 32, { align: 'right' });

    // --- Hero Section (Amount & Status) ---
    let yPos = 80;

    // Amount
    doc.setTextColor(amountColor);
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    const amountPrefix = isCredit ? '+' : '-';
    const amountText = `${amountPrefix} NGN ${transaction.amount.toLocaleString()}`;
    doc.text(amountText, 105, yPos, { align: 'center' });

    // Status Badge
    yPos += 15;
    doc.setFillColor(statusColor);
    doc.setDrawColor(statusColor);
    // Calculate badge width based on text
    const statusText = transaction.status.toUpperCase();
    doc.setFontSize(10);
    const textWidth = doc.getTextWidth(statusText);
    const badgeWidth = textWidth + 16;

    // Draw rounded rectangle for badge
    doc.roundedRect(105 - (badgeWidth / 2), yPos - 6, badgeWidth, 9, 3, 3, 'F');

    doc.setTextColor(white);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, 105, yPos, { align: 'center' });

    // Date
    yPos += 15;
    doc.setTextColor(textLight);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(format(new Date(transaction.created_at), "MMMM d, yyyy 'at' h:mm a"), 105, yPos, { align: 'center' });

    // --- Details Table ---
    const tableData = [
        ['Transaction Type', isCredit ? 'Wallet Funding' : 'Service Payment'],
        ['Reference ID', transaction.reference || 'N/A'],
        ['Description', transaction.description || 'N/A'],
        ['Payment Method', 'Wallet Balance'],
        ['User Name', user?.full_name || 'N/A'],
        ['User Email', user?.email || 'N/A'],
    ];

    autoTable(doc, {
        startY: yPos + 20,
        margin: { left: 20, right: 20 },
        head: [],
        body: tableData,
        theme: 'plain', // Clean look
        styles: {
            fontSize: 11,
            cellPadding: 12,
            textColor: textDark,
        },
        columnStyles: {
            0: {
                fontStyle: 'normal',
                textColor: textLight,
                cellWidth: 80,
            },
            1: {
                fontStyle: 'bold',
                textColor: textDark,
                halign: 'right',
            },
        }
    });

    // --- Footer ---
    const finalY = (doc as any).lastAutoTable.finalY + 40; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Brand Message
    doc.setTextColor(brandBlue);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EZY VTU', 105, finalY, { align: 'center' });

    doc.setTextColor(textLight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('The smartest way to pay bills in Nigeria.', 105, finalY + 6, { align: 'center' });

    // Contact Info
    doc.setFontSize(9);
    doc.setTextColor(textLight);
    doc.text('www.ezyvtu.com.ng  |  support@ezyvtu.com.ng', 105, finalY + 16, { align: 'center' });

    // Save
    doc.save(`EZYVTU-Receipt-${transaction.reference || 'transaction'}.pdf`);
};
