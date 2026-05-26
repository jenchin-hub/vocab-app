import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 部署在 https://USERNAME.github.io/REPO/
// base 在 GitHub Actions 中會由環境變數帶入
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
})
