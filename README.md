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

- **Framework**: Next.js 16 (App Router)
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

---

## Deploying to Vercel

Vercel is the native platform for Next.js applications and provides optimal performance out of the box.

### Deployment Options:

#### Option 1: Via Vercel Dashboard (Recommended)
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://app.ezyvtu.com.ng/api/v1`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: `pk_live_...`
5. Click **Deploy**.

#### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

---

## Deploying to Railway

This project is also configured for **Railway** deployment using Docker standalone build.

### Deployment Steps:
1. Go to [Railway Dashboard](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository.
4. Under **Variables** in Railway, add:
   - `NEXT_PUBLIC_API_URL`: `https://app.ezyvtu.com.ng/api/v1`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: `pk_live_...`
5. Railway will build and deploy using `railway.json` & `Dockerfile`.
