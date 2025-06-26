Write-Host "🚀 Northland ALX - GitHub Pages Deployment Script" -ForegroundColor Green
Write-Host ""

# Set Git path
$gitPath = "C:\Program Files\Git\bin\git.exe"

# Check if Git exists
if (-not (Test-Path $gitPath)) {
    Write-Host "❌ Git is not found at $gitPath" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/windows" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Git found, proceeding with deployment..." -ForegroundColor Green
Write-Host ""

# Set location to script directory
Set-Location -Path $PSScriptRoot

# Initialize repository if not already done
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    & $gitPath init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to initialize Git repository" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Add all files
Write-Host "📦 Adding files to Git..." -ForegroundColor Yellow
& $gitPath add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = "🚀 Northland ALX website deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
& $gitPath commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Nothing to commit or commit failed" -ForegroundColor Yellow
}

# Check if remote origin exists
$remoteExists = $false
try {
    & $gitPath remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0) {
        $remoteExists = $true
    }
} catch {
    $remoteExists = $false
}

if (-not $remoteExists) {
    Write-Host "🔗 Adding remote repository with token authentication..." -ForegroundColor Yellow
    $token = $env:GITHUB_TOKEN
    if (-not $token) {
        $token = Read-Host "Enter your GitHub Personal Access Token"
    }
    & $gitPath remote add origin "https://$token@github.com/northlandalxsystems/githubPages.git"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to add remote repository" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "🔄 Updating remote URL with token authentication..." -ForegroundColor Yellow
    $token = $env:GITHUB_TOKEN
    if (-not $token) {
        $token = Read-Host "Enter your GitHub Personal Access Token"
    }
    & $gitPath remote set-url origin "https://$token@github.com/northlandalxsystems/githubPages.git"
}

# Ensure we're on main branch
& $gitPath branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set main branch" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Fetch latest changes from remote
Write-Host "🔄 Fetching latest changes from remote..." -ForegroundColor Yellow
& $gitPath fetch origin main 2>$null

# Check if remote is ahead and merge if needed
Write-Host "🔄 Checking for remote changes..." -ForegroundColor Yellow
& $gitPath merge origin/main --allow-unrelated-histories 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Merge conflicts detected or merge failed" -ForegroundColor Yellow
    Write-Host "Trying to force push instead..." -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "🌐 Pushing to GitHub..." -ForegroundColor Yellow
& $gitPath push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Normal push failed, trying force push..." -ForegroundColor Yellow
    & $gitPath push -u origin main --force
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to push to GitHub even with force" -ForegroundColor Red
        Write-Host "Please check your GitHub credentials and repository access" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "Your website will be available at:" -ForegroundColor Cyan
Write-Host "https://northlandalxsystems.github.io/githubPages/" -ForegroundColor White
Write-Host ""
Write-Host "Note: It may take 2-5 minutes for changes to appear on the live site." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/northlandalxsystems/githubPages" -ForegroundColor White
Write-Host "2. Click Settings > Pages" -ForegroundColor White
Write-Host "3. Set Source to 'Deploy from a branch'" -ForegroundColor White
Write-Host "4. Select 'main' branch and '/' root folder" -ForegroundColor White
Write-Host "5. Click Save" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
