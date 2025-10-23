import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Replace 'PW-R' and 'Jewery' with your actual GitHub username and repo name
export default defineConfig({
  plugins: [react()],
  base: '/Jewery/', // 👈 important! matches your repo name
})
