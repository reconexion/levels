import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    // Untitled UI's generated components import from "@/..." (its convention, mirrored here
    // without a tsconfig since this project isn't TypeScript).
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
