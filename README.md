# 🍺 PubManager SaaS — Complete Setup Guide

## Tech Stack
- **React 18** + **Vite**
- **Redux Toolkit** + **Axios** (all data fetching)
- **Context API** (authentication only)
- **Supabase** (database + auth)
- **React Leaflet** + **OpenStreetMap** (free maps)
- **Razorpay** (payments)
- **Recharts** (analytics charts)

---

## 🚀 Setup in 5 Steps

### Step 1 — Supabase Setup
1. Go to [supabase.com](https://supabase.com) → Create project
2. Go to **SQL Editor** → Run entire `supabase-setup.sql`
3. Go to **Settings → API** → Copy your URL and anon key

### Step 2 — Configure credentials
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 3 — Configure Razorpay
Open `src/pages/onboarding/Step4Subscription.jsx`
Replace `YOUR_RAZORPAY_KEY_ID` with your Razorpay Key ID from [razorpay.com](https://razorpay.com)

### Step 4 — Install & Run
```bash
npm install
npm run dev
```

### Step 5 — Open browser
```
http://localhost:5173
```

---

## 🗺️ App Flow

```
/signup → Onboarding (4 steps) → Dashboard
/login  → Dashboard (if already set up)
```

### Onboarding Steps:
1. **Pub Details** — Name, phone, description
2. **Location** — OpenStreetMap pin your pub
3. **First Event** — Optional, create first event
4. **Choose Plan** — Free trial (30 days) or paid via Razorpay

---

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.jsx          ← Supabase auth (Context API)
├── store/
│   ├── store.js                 ← Redux store
│   └── slices/
│       ├── eventsSlice.js       ← Events CRUD via Axios
│       ├── bookingsSlice.js     ← Bookings CRUD via Axios
│       ├── staffSlice.js        ← Staff CRUD via Axios
│       └── analyticsSlice.js   ← Real analytics from Supabase
├── api/
│   └── axiosInstance.js        ← Axios + Supabase REST headers
├── pages/
│   ├── auth/                   ← Login, Signup, ForgotPassword
│   ├── onboarding/             ← 4-step onboarding flow
│   └── dashboard/              ← All dashboard pages
├── components/
│   ├── ProtectedRoute.jsx      ← Route guards
│   ├── EventFormStep1.jsx      ← Basic info + OpenStreetMap
│   ├── EventFormStep2.jsx      ← Event packages (Basic/VIP/Premium/Table)
│   └── Toast.jsx               ← Notifications
└── lib/
    └── supabase.js             ← Supabase client
```

---

## 💳 Subscription Plans

| Plan | Price | Period |
|------|-------|--------|
| Free Trial | ₹0 | 30 days |
| Starter | ₹2,499 | Monthly |
| Pro | ₹6,499 | Monthly |
| Enterprise | ₹16,499 | Yearly |

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `tenants` | Pub profiles |
| `subscriptions` | Plan & trial management |
| `events` | Events with location |
| `event_packages` | Basic/VIP/Premium/Table packages |
| `bookings` | Customer bookings |
| `staff` | Staff members |

All tables have **Row Level Security** — each pub only sees their own data.
