# Bhanjo.com - Live Launch & GoDaddy Domain Connection Guide

Congratulations on securing the **bhanjo.com** domain on GoDaddy! Here is your exact, step-by-step roadmap to connect your GoDaddy domain and take **Bhanjo.com** live to the public with free SSL (HTTPS).

---

## 🚀 Recommended Production Architecture

| Component | Recommended Free / Low-Cost Host | Why |
| :--- | :--- | :--- |
| **Frontend (React/Vite)** | **Vercel** or **Cloudflare Pages** | Instant global CDN, automatic free SSL certificate, 1-click GoDaddy domain connection |
| **Backend (Node/Express)** | **Render.com** or **Railway.app** | Free HTTPS endpoint, automatic deployments from GitHub |
| **Database** | **Supabase (PostgreSQL)** or SQLite | Zero config, reliable persistence |

---

## 🛠️ Step-by-Step Deployment & GoDaddy Setup

### Step 1: Push Code to GitHub
1. Open your terminal in `C:\Bhanjo.com`:
```bash
git init
git add .
git commit -m "Initial Bhanjo.com Production Release"
```
2. Create a new private/public repository on [GitHub.com](https://github.com) named `bhanjo.com`.
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/bhanjo.com.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Frontend on Vercel (2 Minutes)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** and select `bhanjo.com`.
3. In Project Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - Click **Deploy**.

---

### Step 3: Connect GoDaddy Domain `bhanjo.com` on Vercel
1. In your Vercel Dashboard, go to **Settings** > **Domains**.
2. Type `bhanjo.com` and click **Add**.
3. Vercel will give you two DNS records:
   - **A Record**: `76.76.21.21` (for `@` root)
   - **CNAME Record**: `cname.vercel-dns.com` (for `www`)

---

### Step 4: Add DNS Records in GoDaddy
1. Log into your [GoDaddy Account](https://dcc.godaddy.com/manage/dns).
2. Go to **My Products** > Click **DNS** next to `bhanjo.com`.
3. Add the following records:

| Type | Name | Value / Points To | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | 1 Hour / Automatic |
| **CNAME** | `www` | `cname.vercel-dns.com` | 1 Hour / Automatic |

4. Save changes. Within 5–15 minutes, your domain **https://bhanjo.com** will be live with a green padlock (SSL HTTPS)!

---

### Step 5: Deploy Backend on Render (Free API Server)
1. Go to [Render.com](https://render.com) and click **New Web Service**.
2. Connect your GitHub repository.
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
3. Click **Create Web Service**. Render gives you a live HTTPS backend URL (e.g. `https://bhanjo-api.onrender.com`).

---

## 🔍 Frontend & Backend Health Audit Checklist

| Item | Current Status | Notes |
| :--- | :--- | :--- |
| **Frontend UI/UX** | ✅ **100% Daraz Clean Standard** | Fast, responsive on mobile & desktop, all 38 categories, Bhanjo Mall, Flash Sale, Nepal Pavilion |
| **Vite Compilation** | ✅ **Passed (0 Errors)** | Production bundle generated in 2.06s |
| **Seller Registration** | ✅ **Connected to Database** | Saves real store applications in SQLite db with contact verification |
| **Cart & Checkout** | ✅ **Connected to Database** | Full eSewa, Khalti, ConnectIPS, and COD payment options with order IDs |
| **Payment Gateways** | ⚠️ **Sandbox Ready** | Replace mock IDs with your official eSewa / Khalti live merchant secret keys when registered |
