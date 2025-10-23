import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: __dirname,           // the inner Jewery folder
  base: '/Jewery/',          // your GitHub Pages repo name
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),  // ensures dist is in the inner folder
    emptyOutDir: true
  }
})
