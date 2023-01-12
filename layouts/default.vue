<template>
    <div>
        <NavNavbar>
            <template #logo><NuxtLink class="mx-5 p-3 hover:scale-150 transition-all" to="/"><NavLogo /></NuxtLink></template>
            <template #desktop>
                <NuxtLink class="mx-5 p-3 hover:scale-150 transition-all" to="/about/pricing">Pricing</NuxtLink>
                <NuxtLink class="mx-5 p-3" to="/auth/signin">Sign In</NuxtLink>
                <NuxtLink class="mx-5 p-3 border-2 rounded-lg border-secondary hover:border-secondary-light10 transition-all" to="/auth/signup">Sign Up <Icon name="fa6-solid:arrow-right"></Icon></NuxtLink>
            </template>
            <template #mobile>
                <NuxtLink class="w-fit p-5 m-2" to="/about/pricing">Pricing</NuxtLink>
                <NuxtLink class="w-fit p-5 m-2" to="/auth/signin">Sign In</NuxtLink>
                <NuxtLink class="w-fit p-5 m-2 border-2 rounded-lg border-secondary hover:border-secondary-light10 transition-all" to="/auth/signup">Sign Up <Icon name="fa6-solid:arrow-right"></Icon></NuxtLink>
            </template>
        </NavNavbar>
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