/// <reference types="vitest" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    setupFiles: ["test/setup.ts"],
    testTimeout: 60000,
    hookTimeout: 60000,
  },
})
