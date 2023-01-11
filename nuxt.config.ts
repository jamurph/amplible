// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig : {
        openAISecret: "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", //access in SERVER directory only using => const runtimeConfig = useRuntimeConfig(); runtimeConfig.openAISecret
        
        
    },
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
            //TODO - Fade/scale transition
        }
    },
    modules: [
        'nuxt-icon',
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
    }
})
