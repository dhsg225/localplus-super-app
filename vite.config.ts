import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "LocalPlus Super App",
        short_name: "LocalPlus",
        description: "Your local lifestyle companion for Thailand",
        theme_color: "#f97316",
        background_color: "#ffffff",
        display: "standalone"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
      "@/ui-components": path.resolve(__dirname, "./src/ui-components"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/api-integrations": path.resolve(__dirname, "./src/api-integrations"),
      "@shared": path.resolve(__dirname, "./shared")
    }
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/admin/**']
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true
  }
})