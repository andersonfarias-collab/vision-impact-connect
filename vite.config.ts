import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0', // Permite que o servidor seja acessado externamente
    port: 8080,
  },
  preview: {
    host: '0.0.0.0', // Também aplica a configuração ao servidor de pré-visualização
    port: 8080,
    allowedHosts: [
      'web-4visionesg.knkugw.easypanel.host','4visionesg.com.br'
    ]
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

