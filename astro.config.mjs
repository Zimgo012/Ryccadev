// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
    site: env.SITE_URL || "http://localhost:8086",
    base: env.BASE_PATH || "/",

    server: {
        port: 8086,
        host: true,
    },
});