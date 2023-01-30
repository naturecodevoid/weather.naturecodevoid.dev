import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: "esnext",
    },
    plugins: [
        svelte(),
        VitePWA({
            manifest: {
                background_color: "#242424",
                categories: ["utilities", "weather"],
                description: "A simplistic interface to weather.gov, designed mainly for mobile devices.",
                display: "fullscreen",
                icons: [
                    {
                        src: "/apple-icon.png",
                        sizes: "180x180",
                    },
                    {
                        src: "/favicon.svg",
                        sizes: "any 512x512",
                        purposes: "maskable",
                    },
                ],
                name: "weather.naturecodevoid.dev",
                orientation: "portrait",
                short_name: "Weather",
                start_url: "/?standalone",
                theme_color: "#242424",
            },
        }),
    ],
});
