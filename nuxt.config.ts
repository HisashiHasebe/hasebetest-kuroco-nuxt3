// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
        // Public keys that are exposed to the client
        public: {
            apiBase: 'https://hasebetest2.g.kuroco.app'
        }
    },
    modules: ['@pinia/nuxt']
})
