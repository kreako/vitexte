import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import Icons from "unplugin-icons/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Icons({ compiler: "jsx", jsx: "react" })],
  server: {
    host: "0.0.0.0",
    port: 3001,
    proxy: {
      "^/api/.*": {
        target: "http://127.0.0.1:3000/",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
