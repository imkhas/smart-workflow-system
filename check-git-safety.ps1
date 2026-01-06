# Git Safety Check Script
# Run this before pushing to GitHub

Write-Host "🔍 Checking for sensitive files..." -ForegroundColor Cyan

# Check if .env files exist and are ignored
$envFiles = Get-ChildItem -Path . -Filter ".env" -Recurse -ErrorAction SilentlyContinue
if ($envFiles) {
    Write-Host "⚠️  Found .env files:" -ForegroundColor Yellow
    $envFiles | ForEach-Object { Write-Host "   - $($_.FullName)" -ForegroundColor Yellow }
    
    # Check if they're in .gitignore
    $gitignoreContent = Get-Content .gitignore -Raw
    if ($gitignoreContent -match "\.env") {
        Write-Host "✅ .env is in .gitignore (SAFE)" -ForegroundColor Green
    } else {
        Write-Host "❌ .env NOT in .gitignore (DANGER!)" -ForegroundColor Red
    }
}

# Check application.properties for sensitive data
Write-Host "`n🔍 Checking application.properties..." -ForegroundColor Cyan
$appProps = "backend\src\main\resources\application.properties"
if (Test-Path $appProps) {
    $content = Get-Content $appProps -Raw
    
    # Check for default/example passwords
    if ($content -match "password=postgres") {
        Write-Host "⚠️  Using default postgres password" -ForegroundColor Yellow
        Write-Host "   Consider using environment variables in production" -ForegroundColor Yellow
    }
    
    # Check for JWT secret
    if ($content -match "jwt.secret=") {
        Write-Host "⚠️  JWT secret in application.properties" -ForegroundColor Yellow
        Write-Host "   This is OK for development, but use env vars in production" -ForegroundColor Yellow
    }
    
    # Check for Telegram token
    if ($content -match "telegram.bot.token=YOUR_BOT_TOKEN_HERE") {
        Write-Host "✅ Telegram token is placeholder (SAFE)" -ForegroundColor Green
    } elseif ($content -match "telegram.bot.token=\d+:") {
        Write-Host "❌ Real Telegram token found (DANGER!)" -ForegroundColor Red
    }
}

# Check what git will commit
Write-Host "`n🔍 Files that will be committed:" -ForegroundColor Cyan
git status --short 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Git not initialized yet" -ForegroundColor Yellow
}

Write-Host "`n✅ Safety check complete!" -ForegroundColor Green
Write-Host "Review the output above before pushing to GitHub." -ForegroundColor Cyan
