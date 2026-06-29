// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
    site: "https://zimgo012.github.io",
    base: "/Ryccadev",

    server: {
        port: 8086,
        host: true,
    },
});