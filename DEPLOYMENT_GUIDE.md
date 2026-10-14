# Archie AI — 24/7 Free Cloud Hosting Guide
Deploy **Backend to Render.com** and **Frontend to Vercel** (both 100% free forever).

---

## Part 1: Push Project to GitHub

If you haven't pushed the project to GitHub yet:
1. Go to [GitHub.com](https://github.com/) and create a new **public** repository named `VastuVision-AI`.
2. Open PowerShell or Terminal in `c:\Users\DELL\Desktop\VastuVision-AI` and run:
   ```bash
   git init
   git add .
   git commit -m "Complete VastuVision AI project"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/VastuVision-AI.git
   git push -u origin main
   ```

---

## Part 2: Deploy Backend to Render.com (Free)

1. Sign up / Log in to [Render.com](https://render.com/) with your GitHub account.
2. Click **New +** → Select **Web Service**.
3. Choose **Build and deploy from a Git repository** → Select your `VastuVision-AI` repository.
4. Configure the settings:
   - **Name**: `vastuvision-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
5. Scroll down to **Environment Variables** and add the following keys:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `AI_TEXT_PROVIDER` | `gemini` |
   | `AI_TEXT_API_KEY` | `your_gemini_api_key_from_env` |
   | `AI_TEXT_MODEL` | `gemini-3.5-flash` |
   | `AI_IMAGE_PROVIDER` | `stability` |
   | `AI_IMAGE_API_KEY` | `your_stability_api_key_from_env` |
   | `AI_IMAGE_MODEL` | `stable-diffusion-xl-1024-v1-0` |
   | `AI_MOCK_MODE` | `false` |
   | `UPLOAD_PROVIDER` | `local` |
6. Click **Deploy Web Service**.
7. Once deployment finishes (2-3 mins), copy your Render backend URL (e.g., `https://vastuvision-backend.onrender.com`).
   - Test it in your browser: `https://vastuvision-backend.onrender.com/api/health` — it should return `{ "success": true, "status": "VastuVision AI API is running" }`.

---

## Part 3: Deploy Frontend to Vercel (Free)

1. Sign up / Log in to [Vercel.com](https://vercel.com/) with your GitHub account.
2. Click **Add New...** → **Project**.
3. Import your `VastuVision-AI` GitHub repository.
4. In the Project Configuration:
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Framework Preset**: `Vite` (auto-detected).
   - **Build Command**: `npm run build` (auto-detected).
   - **Output Directory**: `dist` (auto-detected).
5. Open **Environment Variables** section and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://vastuvision-backend.onrender.com/api` *(use your actual Render URL from Part 2)* |
6. Click **Deploy**.
7. In ~30 seconds, your site will be live at a URL like:
   `https://vastuvision-ai.vercel.app`

---

## Testing Your Live Deployment

1. Visit your Vercel URL (e.g. `https://vastuvision-ai.vercel.app`).
2. Verify the green badge at the bottom says: `Backend connected · AI ready`.
3. Click **Start Designing Now** → input room specifications → generate 6-view 3D layouts live on the cloud!
