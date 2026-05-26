# Root·Dict 一鍵部署 to GitHub Pages (Windows PowerShell)
# 用法: .\deploy.ps1 <github-username> <repo-name>

param(
    [Parameter(Mandatory=$true)][string]$Username,
    [Parameter(Mandatory=$true)][string]$Repo
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "`n$msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Err($msg)  { Write-Host "✗ $msg" -ForegroundColor Red }

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Root·Dict 一鍵部署 to GitHub Pages" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 1. 檢查環境
Write-Step "[1/6] 檢查環境..."
foreach ($tool in @("git", "node", "npm")) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Err "缺少 $tool"
        if ($tool -eq "node") { Write-Host "請至 https://nodejs.org 下載 LTS 版本" }
        exit 1
    }
}
Write-Ok "環境齊全"

# 2. 安裝套件
Write-Step "[2/6] 安裝套件 (約 1-2 分鐘)..."
npm install
if ($LASTEXITCODE -ne 0) { Write-Err "npm install 失敗"; exit 1 }
Write-Ok "套件安裝完成"

# 3. 測試 build
Write-Step "[3/6] 測試 build..."
$env:VITE_BASE = "/$Repo/"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Err "build 失敗"; exit 1 }
Write-Ok "Build 成功"

# 4. Git 設定
Write-Step "[4/6] 設定 Git..."
if (-not (Test-Path ".git")) {
    git init -b main
    Write-Ok "已初始化 Git"
}

$remoteUrl = "https://github.com/$Username/$Repo.git"
$existingRemote = git remote 2>$null
if ($existingRemote -match "origin") {
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}
Write-Ok "遠端設定為 $remoteUrl"

# 5. Push
Write-Step "[5/6] 推送到 GitHub..."
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy: $timestamp" 2>$null
git push -u origin main
if ($LASTEXITCODE -ne 0) { Write-Err "push 失敗,可能需要先建立 GitHub repo"; exit 1 }
Write-Ok "已推送"

# 6. 完成
Write-Step "[6/6] 部署中..."
Write-Host "`n======================================" -ForegroundColor Green
Write-Host "✓ 推送完成!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

Write-Host "`n接下來:"
Write-Host "1. 開啟瀏覽器到 " -NoNewline
Write-Host "https://github.com/$Username/$Repo/settings/pages" -ForegroundColor Cyan
Write-Host "2. Source 選擇 " -NoNewline
Write-Host "GitHub Actions" -ForegroundColor Cyan
Write-Host "3. 等待 2-3 分鐘建置完成"

Write-Host "`n你的網站將會在: " -NoNewline
Write-Host "https://$Username.github.io/$Repo/" -ForegroundColor Green
Write-Host "`n部署進度查看: " -NoNewline
Write-Host "https://github.com/$Username/$Repo/actions" -ForegroundColor Cyan
