import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  preview: {
    host: true, // Necessário para ser acessível no container
    allowedHosts: [
      'web-dominos.knkugw.easypanel.host',
      'domino.sjumper.qzz.io',
    ],
  },
  server: {
    host: true,
    allowedHosts: [
      'web-4vesg.knkugw.easypanel.host',
      '4visionesg.com.br',
    ],
  },
});
