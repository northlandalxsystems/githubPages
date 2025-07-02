@echo off
echo 🚀 Northland ALX - GitHub Pages Deployment Script
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git is not installed or not found in PATH
    echo Please install Git from: https://git-scm.com/download/windows
    echo.
    pause
    exit /b 1
)

echo ✅ Git found, proceeding with deployment...
echo.

REM Initialize repository if not already done
if not exist .git (
    echo 📁 Initializing Git repository...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to initialize Git repository
        pause
        exit /b 1
    )
)

REM Add all files
echo 📦 Adding files to Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)

REM Commit changes
echo 💾 Committing changes...
git commit -m "🚀 Northland ALX website deployment - %date% %time%"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Nothing to commit or commit failed
)

REM Add remote origin if not exists
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 🔗 Adding remote repository...
    git remote add origin https://github.com/northlandalxsystems/githubPages.git
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to add remote repository
        pause
        exit /b 1
    )
) else (
    echo 🔄 Remote repository already configured
)

REM Ensure we're on main branch
git branch -M main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to set main branch
    pause
    exit /b 1
)

REM Fetch latest changes from remote
echo 🔄 Fetching latest changes from remote...
git fetch origin main

REM Check if remote is ahead and merge if needed
echo 🔄 Checking for remote changes...
git merge origin/main --allow-unrelated-histories
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Merge conflicts detected or merge failed
    echo Trying to force push instead...
)

REM Push to GitHub
echo 🌐 Pushing to GitHub...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Normal push failed, trying force push...
    git push -u origin main --force
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to push to GitHub even with force
        echo Please check your GitHub credentials and repository access
        pause
        exit /b 1
    )
)

echo.
echo 🎉 Deployment successful!
echo.
echo Your website will be available at:
echo https://northlandalxsystems.github.io/githubPages/
echo.
echo Note: It may take 2-5 minutes for changes to appear on the live site.
echo.
echo Next steps:
echo 1. Go to https://github.com/northlandalxsystems/githubPages
echo 2. Click Settings ^> Pages
echo 3. Set Source to "Deploy from a branch"
echo 4. Select "main" branch and "/" root folder
echo 5. Click Save
echo.
pause
