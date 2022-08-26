import { defineNuxtConfig } from "nuxt";
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    tado: {
      username: "",
      password: "",
      client_id: "",
      client_secret: "",
      auth_url: "",
      api_url: "",
    },
  },

  css: ["@/assets/css/tailwind.css"],

  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
});
