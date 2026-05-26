# Root·Dict 字根詞典

從字根字首字尾出發的單字學習 App,涵蓋國中、高中、全民英檢中級與中高級字彙。

## 一鍵部署到 GitHub Pages

### 前置作業(只需做一次)

1. **安裝 Node.js**
   - Mac: 下載 [Node.js LTS](https://nodejs.org) 或 `brew install node`
   - Windows: 下載 [Node.js LTS](https://nodejs.org)

2. **安裝 Git**
   - Mac: 終端機輸入 `git --version`,沒有就會跳出安裝提示
   - Windows: [下載 Git for Windows](https://git-scm.com/download/win)

3. **登入 GitHub 並建立空 repo**
   - 到 https://github.com/new
   - Repository name 填一個名字,例如 `vocab-app`
   - **不要勾選** "Add a README" 或 ".gitignore"(保持完全空)
   - 點 Create repository
   - 記下你的 username 與 repo 名

### 部署(每次更新都跑這個)

**Mac / Linux**

```bash
# 第一次需要加執行權限
chmod +x deploy.sh

# 執行,把 USERNAME 跟 REPO 換成你的
./deploy.sh USERNAME REPO

# 範例
./deploy.sh brianliu vocab-app
```

**Windows PowerShell**

```powershell
# 如果第一次跑被擋,先放行
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# 執行
.\deploy.ps1 -Username USERNAME -Repo REPO

# 範例
.\deploy.ps1 -Username brianliu -Repo vocab-app
```

### 首次部署的額外步驟

第一次推送後,需要到 GitHub 開啟 Pages:

1. 開啟 `https://github.com/USERNAME/REPO/settings/pages`
2. **Source** 下拉選單選擇 **"GitHub Actions"**
3. 等 2-3 分鐘讓 Actions 跑完
4. 網站就會出現在 `https://USERNAME.github.io/REPO/`

之後每次跑 `./deploy.sh` 或 `.\deploy.ps1`,都會自動更新網站,**完全不用手動操作 GitHub**。

## 本機開發

```bash
npm install      # 安裝依賴(只需做一次)
npm run dev      # 開發模式,瀏覽器開 http://localhost:5173
npm run build    # 編譯成正式版到 dist/
npm run preview  # 預覽編譯後的網站
```

## 技術棧

- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React (icons)

## 字庫規模

- 77 個高頻字根
- 501 個單字
- 涵蓋 4 個難度:國中、高中、全民英檢中級、中高級

## 功能

- 字根拆解視覺化
- 間隔重複閃卡 (SRS)
- 選擇題測驗
- 學習進度追蹤
- 不熟字雲(視覺化弱點)
- 每日學習目標
- 難度等級篩選

## 設計

採用 Vodafone 設計語言:純白底、Vodafone Red (#E60000) 強調色、紀念碑式大寫字體、紅色 chapter band 章節帶。
