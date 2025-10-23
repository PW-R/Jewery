import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import path from 'path'

export default defineConfig({
  root: __dirname,           // the inner Jewery folder
  base: '/Jewery/',          // your GitHub Pages repo name
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),  // ensures dist is in the inner folder
    emptyOutDir: true
  }
=======

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
>>>>>>> c9104980d03da50350e8c4c3bc71712b8c4e66c3
})
