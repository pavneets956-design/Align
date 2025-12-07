# 📤 How to Push Code to GitHub - Quick Guide

## If Your Code is NOT on GitHub Yet

### Step 1: Create GitHub Repository

1. Go to **[github.com](https://github.com)** and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `talking-light` (or your choice)
   - **Description:** (optional) "ALIGN - Talking Light mobile app"
   - **Visibility:** Choose **Public** or **Private**
   - **⚠️ IMPORTANT:** Do NOT check "Add a README file" (you already have code)
   - **⚠️ IMPORTANT:** Do NOT add .gitignore or license (you already have these)
4. Click **"Create repository"**

---

### Step 2: Push Your Code

**Open PowerShell/Terminal in your project folder:**

```powershell
# Navigate to your project
cd C:\Users\gillp\CascadeProjects\talking-light

# Check if it's already a git repo
git status
```

**If you see "not a git repository":**

```powershell
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - ready for deployment"

# Rename branch to main (if needed)
git branch -M main

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/talking-light.git

# Push to GitHub
git push -u origin main
```

**If it's already a git repo:**

```powershell
# Just add, commit, and push
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

### Step 3: Verify on GitHub

1. Go to your GitHub repository page
2. You should see all your files:
   - `apps/` folder
   - `server/` folder
   - `README.md`
   - etc.

---

## If You Get Authentication Errors

### Option 1: Use GitHub Desktop (Easiest)

1. Download **[GitHub Desktop](https://desktop.github.com/)**
2. Sign in with your GitHub account
3. File → Add Local Repository → Select your project folder
4. Click "Publish repository" → Done!

### Option 2: Use Personal Access Token

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Give it `repo` permissions
3. Copy the token
4. When pushing, use token as password:
   ```powershell
   git push origin main
   # Username: your-github-username
   # Password: paste-your-token-here
   ```

---

## ✅ Once Pushed to GitHub

You can now import it into Vercel! See `VERCEL_DEPLOYMENT_STEPS.md` for next steps.

