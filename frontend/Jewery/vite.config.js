import { defineConfig } from 'vite' // ✅ Required to use defineConfig
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 👇 Set the `base` path to your GitHub repo name for GitHub Pages
  base: '/Jewery/',

  build: {
    // Optional: reduce large chunk warnings by splitting vendor code
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000 // increase warning limit if needed
  }
})
