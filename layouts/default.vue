<template>
    <div>
        <slot></slot>
    </div>
</template>

<script setup>
    //put in metadata
    const route = useRoute()
    useHead({
        meta: [
            { name: 'description', content: `${route.meta.description}` },
            { property: 'og:title', content: `${route.meta.title}` },
            { property: 'og:type', content: `website` },
            { property: 'og:site_name', content: `Amplible` },
            { property: 'og:description', content: `${route.meta.description}` },
            { property: 'og:url', content: `${route.fullPath}` },
            { property: 'og:image', content: `~/images/amplible169.jpg` },

            { name: 'twitter:card', content: `summary_large_image` },
            { name: 'twitter:title', content: `${route.meta.title}` },
            { name: 'twitter:description', content: `${route.meta.description}` },
            { name: 'twitter:image', content: `~/images/amplible169.jpg` },
            { name: 'twitter:image:alt', content: `Amplible Logo` },
        ]
    })
</script>