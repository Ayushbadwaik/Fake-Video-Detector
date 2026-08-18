# 🚀 Free 1-Click Hosting Guide for FakeDetect Forensics

Your project is configured so that **FastAPI serves both the frontend website and the Python AI backend together as a single application**. You only need to host **ONE web service link** on [Render.com](https://render.com) (100% Free).

---

## Option 1: Render.com (Recommended Free Hosting)

Render offers **free hosting** for Python + Node apps. 

### Step-by-Step Instructions:

1. **Push your code to GitHub**:
   - Create a repository on GitHub (e.g. `fake-video-detection`).
   - Run these commands in your project directory:
     ```bash
     git init
     git add .
     git commit -m "Configure 1-click single-host deployment"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/fake-video-detection.git
     git push -u origin main
     ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com) and log in / create a free account.
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository (`fake-video-detection`).
   - Fill in the settings (Render will detect `render.yaml` automatically, or set manually):
     - **Name**: `fakedetect-ai` (or any name you prefer)
     - **Environment**: `Python 3`
     - **Build Command**:
       ```bash
       npm install && npm run build && pip install -r requirements.txt
       ```
     - **Start Command**:
       ```bash
       python backend/main.py
       ```
     - **Instance Type**: `Free`

3. **Get Your Single Shared Link**:
   - Render will build your app and give you **ONE link** (e.g. `https://fakedetect-ai.onrender.com`).
   - When you open this single link, the website will load and automatically connect to its own Python AI backend without needing any separate backend server!

---

## Option 2: Local Single-Link Host (No Cloud Upload Needed)

If you just want to run **1 command on your computer** and open **1 link** in your browser:

1. Build the production bundle:
   ```cmd
   cmd /c npm run build
   ```

2. Start the single Python server:
   ```cmd
   python backend/main.py
   ```

3. Open **`http://localhost:8000`** in your browser. Both the web UI and the Python OpenCV/FFT forensic engine run seamlessly on this single URL!
