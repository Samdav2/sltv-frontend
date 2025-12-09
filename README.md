# SLTV Frontend

This is the frontend application for SLTV, built with Next.js, Tailwind CSS, and TypeScript.

## Features

- **Homepage**: Modern, responsive landing page with animations.
- **Authentication**: Login, Register, Forgot Password.
- **Dashboard**: Wallet balance, quick actions, and transaction history.
- **Services**:
  - Airtime Purchase (MTN, Glo, Airtel, 9mobile)
  - Data Bundle Purchase
  - Cable TV Subscription (DSTV, GOTV, StarTimes)
  - Electricity Bill Payment (Prepaid/Postpaid)
- **Wallet**: Fund wallet via Paystack.
- **Profile**: Manage user details.
- **Support**: Create and view support tickets.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **HTTP Client**: Axios

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

- **API URL**: The app connects to the backend API. You can configure the base URL in `lib/api.ts` or via environment variables (`NEXT_PUBLIC_API_URL`).

## Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components and layout blocks.
- `/lib`: Utility functions and API client.
- `/types`: TypeScript definitions.
