// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig : {
        openAISecret: process.env.OPENAI_SECRET, //access in SERVER directory only using => const runtimeConfig = useRuntimeConfig(); runtimeConfig.openAISecret
        public: {
            supabaseURL: process.env.SUPABASE_URL,
            supabasePublicKey: process.env.SUPABASE_KEY,
        }
    },
    css: ['~/assets/scss/_global.scss'],
    app: {
        head: {
            meta: [
                // <meta name="viewport" content="width=device-width, initial-scale=1">
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            noscript: [
                // <noscript>Javascript is required</noscript>
                { children: 'Javascript is required to use this site.' }
            ],
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Ubuntu'
                }
            ],
        },
        pageTransition : {
            name:"page", appear:true, mode: "out-in"
        }
    },
    modules: [
        'nuxt-icon',
        '@nuxtjs/supabase',
        '@nuxtjs/tailwindcss',
        [
            '@pinia/nuxt', {
                autoImports: [
                    // automatically imports `defineStore`
                    'defineStore', // import { defineStore } from 'pinia'
                    // automatically imports `defineStore` as `definePiniaStore`
                    ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
                ],
            }
        ]
          
    ],
    vite: {
        css: {
          preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/scss/_colors.scss" as *;'
                }
            }
        }
    },
})
