import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { ViteToml } from 'vite-plugin-toml'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteToml()],
  resolve: {
    alias: {
      "@/": path.join(__dirname, "src/")
    }
  }
})
