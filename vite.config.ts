import { defineConfig } from "vite";

export default defineConfig({
  // ...suas configs
  preview: {
    allowedHosts: [
      'web-4vesg.knkugw.easypanel.host'
    ],
    port: 80 // se estiver usando essa porta
  }
})
