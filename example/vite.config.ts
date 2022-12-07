import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import magicImg from 'magic-img/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    magicImg(),
    react()
  ]
})
