import { defineConfig,loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname); // Load environment variables with the correct path
  console.log('VITE_PWA_ENABLED:', env.VITE_PWA_ENABLED);

  return {
  plugins: [
    react(),
    legacy({
      targets: [">0.2%", "not dead", "not op_mini all"],
    }),
    VitePWA({
      manifest: {
        short_name: "Kouture Konnect",
        name: "Kouture Konnect",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
      },
      devOptions: {
        enabled: env.VITE_PWA_ENABLED === "true", // Correct use of environment variable
         },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/src/Assets'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50, // Adjust max entries as needed
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
              },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      Assets: path.resolve(__dirname, "./src/Assets"),
      Components: path.resolve(__dirname, "./src/Components"),
      Utils: path.resolve(__dirname, "./src/Utils"),
      store: path.resolve(__dirname, "./src/store"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      services: path.resolve(__dirname, "./src/services"),
    },
  },
}
});
