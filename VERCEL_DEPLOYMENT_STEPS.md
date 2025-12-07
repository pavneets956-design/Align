# 📦 How to Import GitHub Repo into Vercel - Step by Step

## Prerequisites
- ✅ Your code is pushed to GitHub (if not, see Step 0 below)
- ✅ You have a GitHub account
- ✅ You have a Vercel account (or can sign up for free)

---

## Step 0: Push Code to GitHub (If Not Already Done)

### If your code is NOT on GitHub yet:

1. **Create a GitHub repository:**
   - Go to [github.com](https://github.com)
   - Click **"+"** (top right) → **"New repository"**
   - Name it: `talking-light` (or whatever you want)
   - Choose **Public** or **Private**
   - **Don't** initialize with README (you already have code)
   - Click **"Create repository"**

2. **Push your local code to GitHub:**
   ```bash
   # In your project root (C:\Users\gillp\CascadeProjects\talking-light)
   git init  # If not already a git repo
   git add .
   git commit -m "Initial commit - ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/talking-light.git
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 1: Sign In to Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended - easiest)
4. Authorize Vercel to access your GitHub account

---

## Step 2: Import Your Repository

1. **After signing in, you'll see the Vercel dashboard**
2. Click the **"Add New..."** button (top right)
3. Select **"Project"** from the dropdown

4. **You'll see a list of your GitHub repositories:**
   - If you don't see your repo, click **"Adjust GitHub App Permissions"**
   - Make sure Vercel has access to the repository you want
   - You may need to click **"Select repositories"** and choose your repo

5. **Find your repository** (e.g., `talking-light`) in the list
6. Click **"Import"** next to your repository

---

## Step 3: Configure Project Settings

After clicking Import, you'll see the **"Configure Project"** page:

### Framework Preset
- **Should auto-detect:** Next.js
- If not, select **"Next.js"** from the dropdown

### Root Directory
- **IMPORTANT:** Click **"Edit"** next to Root Directory
- Change from `/` to: **`apps/web`**
- This tells Vercel where your Next.js app is located

### Build and Output Settings
- **Build Command:** Should be `npm run build` (or `cd apps/web && npm run build`)
- **Output Directory:** Should be `.next` (default for Next.js)
- **Install Command:** Should be `npm install` (default)

### Environment Variables
Click **"Environment Variables"** and add:

```
OPENAI_API_KEY=sk-your-actual-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_live_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

**Important:**
- Add **all** environment variables your backend needs
- You can find these in your local `.env` file in `apps/web/`
- Click **"Add"** after each variable
- Make sure to add them for **Production**, **Preview**, and **Development** (or just Production if you want)

---

## Step 4: Deploy

1. **Review all settings** (especially Root Directory = `apps/web`)
2. Click **"Deploy"** button (bottom right)
3. **Wait 2-3 minutes** while Vercel:
   - Installs dependencies
   - Builds your Next.js app
   - Deploys to production

---

## Step 5: Get Your Deployment URL

1. **After deployment completes**, you'll see:
   - ✅ "Congratulations! Your project has been deployed"
   - A URL like: `https://talking-light-abc123.vercel.app`

2. **Copy this URL** - this is your production backend URL!

3. **Test it:**
   - Open: `https://your-url.vercel.app/api/align/chat` in browser
   - Should see an error (needs POST), but confirms route exists
   - Or test: `https://your-url.vercel.app/api/health` if you have one

---

## Step 6: Update Mobile App with Production URL

1. **Edit:** `apps/mobile/src/config/api.ts`

2. **Find this line:**
   ```typescript
   const PROD_BACKEND_URL = 'https://your-app.vercel.app';
   ```

3. **Replace with your actual Vercel URL:**
   ```typescript
   const PROD_BACKEND_URL = 'https://talking-light-abc123.vercel.app'; // Your actual URL
   ```

4. **Save the file**

---

## Step 7: Rebuild Mobile App

```bash
cd apps/mobile/android
./gradlew assembleRelease
```

Install the new APK on your Samsung → Done! ✅

---

## 🔧 Troubleshooting

### "Repository not found" or can't see your repo

**Fix:**
1. Go to GitHub → Settings → Applications → Authorized OAuth Apps
2. Find Vercel → Click "Configure"
3. Make sure your repository is selected
4. Go back to Vercel and try importing again

### Build fails with "Cannot find module"

**Fix:**
- Make sure **Root Directory** is set to `apps/web`
- Check that `apps/web/package.json` exists
- Verify build command is correct

### Environment variables not working

**Fix:**
- Make sure you added them in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new variables

### API returns 404

**Fix:**
- Check your API routes are in `apps/web/app/api/`
- Verify the route path matches what you're calling
- Check Vercel build logs for errors

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created and connected to GitHub
- [ ] Repository imported to Vercel
- [ ] Root Directory set to `apps/web`
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Got production URL
- [ ] Updated mobile app config with production URL
- [ ] Rebuilt mobile app in release mode
- [ ] Tested - app works without `npm run dev`

---

## 🎉 You're Done!

Your backend is now live on the internet. Your mobile app will work anywhere, anytime, without needing your laptop running `npm run dev`.

**Next:** Every time you push to GitHub, Vercel will automatically redeploy! 🚀

