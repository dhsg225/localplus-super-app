import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Explicitly tell the plugin to process JSX in all relevant file types.
      include: '**/*.{js,jsx,ts,tsx}',
    }),
  ],
})
