import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CLIENT_PORT } from './config/ports'

export default defineConfig({
  plugins: [react()],
  server: {
    port: CLIENT_PORT,
  },
})
