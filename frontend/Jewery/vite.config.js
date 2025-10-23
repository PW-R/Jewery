import { defineConfig } from 'vite'      // ✅ you MUST import defineConfig
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Jewery/'       // 👈 important for GitHub Pages
})
