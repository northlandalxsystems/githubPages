# Deploy to GitHub Pages

## Quick Deployment Steps

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Northland ALX production website"
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/northlandalxsystems/githubPages.git
```

### 3. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository: https://github.com/northlandalxsystems/githubPages
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 5. Your Website Will Be Live At:
```
https://northlandalxsystems.github.io/githubPages/
```

## Custom Domain Setup (Optional)

If you want to use a custom domain like `northlandalx.com`:

1. Add a `CNAME` file to your repository root
2. Configure DNS with your domain provider
3. Enable HTTPS in GitHub Pages settings

## Automatic Deployment

Every time you push changes to the `main` branch, GitHub Pages will automatically rebuild and deploy your site.

## Local Development Server

To test locally before deploying:
```bash
python -m http.server 8080
# or
npx http-server -p 8080
```

Then visit: http://localhost:8080
