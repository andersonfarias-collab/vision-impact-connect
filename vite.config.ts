import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
plugins: [react()],
  preview: {
    host: true, // Necessário para ser acessível no container
    // A linha mais importante:
    allowedHosts: ['web-4vesg.knkugw.easypanel.host','4visionesg.com.br'],
  }
});
