import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true, // Enable source maps for debugging and SEO insights
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    }
  },
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: '0.0.0.0', // Também aplica a configuração ao servidor de pré-visualização
    port: 8080,
    allowedHosts: [
      'web-4visionesg.knkugw.easypanel.host','4visionesg.com.br'
    ]
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
