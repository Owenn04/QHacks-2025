import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  //allow access to localhost on mobile devices as long as its on the same network. go to http://ipv4address:5173 (or whatever port you are using)
  server: {
    host: true
  }
  
})
