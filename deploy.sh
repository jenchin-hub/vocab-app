#!/bin/bash
# 一鍵部署到 GitHub Pages
# 用法: ./deploy.sh <github-username> <repo-name>

set -e  # 遇錯就停

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Root·Dict 一鍵部署 to GitHub Pages${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 檢查參數
if [ "$#" -ne 2 ]; then
    echo -e "${RED}用法: ./deploy.sh <github-username> <repo-name>${NC}"
    echo "範例: ./deploy.sh brianliu vocab-app"
    exit 1
fi

USERNAME=$1
REPO=$2

# 檢查必要工具
echo -e "${BLUE}[1/6] 檢查環境...${NC}"
command -v git >/dev/null 2>&1 || { echo -e "${RED}缺少 git,請先安裝${NC}"; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}缺少 Node.js,請至 https://nodejs.org 下載 LTS 版本${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}缺少 npm${NC}"; exit 1; }
echo -e "${GREEN}✓ 環境齊全${NC}"

# 安裝依賴
echo -e "\n${BLUE}[2/6] 安裝套件 (約 1-2 分鐘)...${NC}"
npm install
echo -e "${GREEN}✓ 套件安裝完成${NC}"

# 本機測試 build
echo -e "\n${BLUE}[3/6] 測試 build...${NC}"
VITE_BASE="/${REPO}/" npm run build
echo -e "${GREEN}✓ Build 成功${NC}"

# Git 初始化
echo -e "\n${BLUE}[4/6] 設定 Git...${NC}"
if [ ! -d ".git" ]; then
    git init -b main
    echo -e "${GREEN}✓ 已初始化 Git${NC}"
fi

# 設定遠端
REMOTE_URL="https://github.com/${USERNAME}/${REPO}.git"
if git remote | grep -q origin; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi
echo -e "${GREEN}✓ 遠端設定為 ${REMOTE_URL}${NC}"

# Commit & Push
echo -e "\n${BLUE}[5/6] 推送到 GitHub...${NC}"
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "(沒有新變更可 commit)"
git push -u origin main
echo -e "${GREEN}✓ 已推送${NC}"

# 完成
echo -e "\n${BLUE}[6/6] 部署中...${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}✓ 推送完成!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "接下來:"
echo -e "1. 開啟瀏覽器到 ${BLUE}https://github.com/${USERNAME}/${REPO}/settings/pages${NC}"
echo -e "2. Source 選擇 ${BLUE}GitHub Actions${NC}"
echo -e "3. 等待 2-3 分鐘建置完成"
echo ""
echo -e "你的網站將會在: ${GREEN}https://${USERNAME}.github.io/${REPO}/${NC}"
echo ""
echo -e "${BLUE}部署進度查看: https://github.com/${USERNAME}/${REPO}/actions${NC}"
