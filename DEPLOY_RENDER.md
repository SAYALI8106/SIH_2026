# Deploying SecureForensics on Render

This guide provides the complete, step-by-step instructions for hosting and deploying **SecureForensics** on [Render](https://render.com) (100% free-tier eligible).

---

## Architecture on Render

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub: SIH_2026 Repository              │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│       Frontend Service        │       │       Backend Service         │
│         (Static Site)         │ HTTPS │         (Web Service)         │
│  React + Vite + Tailwind CSS  │◄─────►│   Python FastAPI + SQLite     │
│   (Oregon, Free Static Site)  │       │       (Oregon, Free Tier)     │
└───────────────────────────────┘       └───────────────────────────────┘
```

Render supports two deployment methods:
- **Method 1 (Recommended & Fastest)**: **1-Click Blueprint Deploy** using the included `render.yaml`.
- **Method 2 (Manual UI)**: Step-by-step manual setup via the Render Dashboard.

---

## Method 1: 1-Click Blueprint Deployment (Recommended)

Because we added `render.yaml` to the root of your repository, Render can automatically create and link both services in a single step:

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. In the top-right corner, click **New +** and select **Blueprint**.
3. Connect your GitHub account and select your repository: **`SAYALI8106/SIH_2026`**.
4. Render will parse `render.yaml` and show:
   - **`secureforensics-backend`** (Web Service — Python / FastAPI)
   - **`secureforensics-frontend`** (Static Site — React / Vite)
5. Click **Apply**.
6. Render will automatically:
   - Build and deploy the FastAPI backend.
   - Inject the backend URL into the frontend as `VITE_API_BASE_URL`.
   - Build and publish the frontend static site with SPA routing rewrites.
7. Once deployed, open your frontend `.onrender.com` URL to view your live app!

---

## Method 2: Manual Dashboard Setup (Step-by-Step)

If you prefer setting up the services manually via the Render UI:

### Step 1: Deploy the Backend (FastAPI Web Service)

1. In your Render Dashboard, click **New +** &rarr; **Web Service**.
2. Select your repository: **`SAYALI8106/SIH_2026`**.
3. Fill in the service configuration:
   - **Name**: `secureforensics-backend`
   - **Region**: `Oregon (US West)` (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
4. Click **Create Web Service**.
5. Wait 1–2 minutes for the build to complete.
6. Once deployed, copy your backend URL from the top of the page:
   ```
   https://secureforensics-backend.onrender.com
   ```
   *(Test it by opening `https://secureforensics-backend.onrender.com/api/health` in your browser — it should return `{"status":"ok",...}`)*

---

### Step 2: Deploy the Frontend (React Static Site — 100% Free)

1. In your Render Dashboard, click **New +** &rarr; **Static Site**.
2. Select your repository: **`SAYALI8106/SIH_2026`**.
3. Fill in the frontend configuration:
   - **Name**: `secureforensics-frontend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   Under the **Environment Variables** section, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://secureforensics-backend.onrender.com/api` *(replace with your actual backend URL from Step 1, adding `/api` at the end)*
5. **Client-Side Routing / Redirects (Crucial for SPAs)**:
   - Scroll down to the **Redirects/Rewrites** section.
   - Click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
   *(This ensures that refreshing or directly accessing pages does not result in 404 errors).*
6. Click **Create Static Site**.
7. Wait 1–2 minutes for Vite to build and publish.
8. Click your frontend URL (e.g. `https://secureforensics-frontend.onrender.com`).
9. **Your SecureForensics app is live on the internet!**

---

## ⚡ Important Render Free-Tier Tips

1. **Free Tier Cold Starts**:
   - Render's free web services automatically spin down after 15 minutes of inactivity.
   - When you access the app after it has been asleep, the backend takes about **30–50 seconds** to wake up on the first request. Subsequent requests are instant.
2. **Persistent Storage**:
   - On the Render Free tier, the SQLite database re-initializes with all seed cases (`CASE-2026-001`, `USB_TEST_01.img`, 147 carved files, audit ledger) on each restart or redeploy. This ensures your presentation and demo state always remains pristine and ready.
3. **CORS Configuration**:
   - The FastAPI backend in `main.py` is configured with `allow_origins=["*"]`, so the frontend can communicate with the backend seamlessly across any Render domain without CORS errors.
