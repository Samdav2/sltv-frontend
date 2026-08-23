# EZY VTU Frontend

This is the frontend application for EZY VTU, built with Next.js 16, Tailwind CSS, and TypeScript.

## Features

- **Homepage**: Modern, responsive landing page with animations.
- **Authentication**: Login, Register, Forgot Password.
- **Dashboard**: Wallet balance, quick actions, and transaction history.
- **Services**:
  - Airtime Purchase (MTN, Glo, Airtel, 9mobile)
  - Data Bundle Purchase
  - Cable TV & SLTV Subscriptions
  - Electricity Bill Payment (Prepaid/Postpaid)
- **Wallet**: Fund wallet via Paystack integration.
- **Profile & Support**: Manage user profile, change password, and ticket-based support system.

## Tech Stack

- **Framework**: Next.js 16 (App Router with Standalone Output)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **HTTP Client**: Axios

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and set the following variables:

```env
NEXT_PUBLIC_API_URL=https://app.ezyvtu.com.ng/api/v1
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key
```

## Deployment on Railway

This project is pre-configured for **Railway** deployment using Docker standalone build.

### Deployment Steps:

1. **Push Code**: Push this repository to GitHub or connect directly via Railway CLI (`railway up`).
2. **New Project on Railway**:
   - Go to [Railway Dashboard](https://railway.app).
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select this repository.
3. **Configure Environment Variables**:
   Under **Variables** in your Railway service, add:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g. `https://app.ezyvtu.com.ng/api/v1`)
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your Paystack Public Key
4. **Deploy**:
   Railway will automatically pick up `railway.json` and `Dockerfile` to build and deploy the Next.js standalone container.
