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

    const user = useSupabaseUser()
    const isLoggedIn = ref(false)

    onMounted(() => {
        watchEffect(()=> {
            isLoggedIn.value = Boolean(user.value)
        })
    })

</script>
<template>
    <div class="min-h-screen" id="amplible-main">
        <NavNavbar>
            <template #logo><NuxtLink class="mx-5" to="/"><NavLogo /></NuxtLink></template>
            <template v-if="!isLoggedIn" #desktop>
                <LinkDefault class="mx-5 p-3" to="/about/pricing">Pricing</LinkDefault>
                <LinkDefault class="mx-5 p-3" to="/auth/signin">Sign In</LinkDefault>
                <LinkDefault class="mx-5 p-3 border-2 rounded-lg border-secondary hover:border-secondary-light10 transition-all" to="/auth/signup">Sign Up <Icon name="fa6-solid:arrow-right"></Icon></LinkDefault>
            </template>
            <template v-if="isLoggedIn" #desktop>
                <LinkDefault class="mx-5 p-3" to="/dashboard">Dashboard</LinkDefault>
                <LinkDefault class="mx-5 p-3" to="/settings">Settings</LinkDefault>
                <LinkDefault class="mx-5 p-3" to="/auth/logout">Logout</LinkDefault>
            </template>
            <template v-if="!isLoggedIn"  #mobile>
                <LinkDefault class="w-fit p-5 m-2" to="/about/pricing">Pricing</LinkDefault>
                <LinkDefault class="w-fit p-5 m-2" to="/auth/signin">Sign In</LinkDefault>
                <LinkDefault class="w-fit p-5 m-2 border-2 rounded-lg border-secondary hover:border-secondary-light10 transition-all" to="/auth/signup">Sign Up <Icon name="fa6-solid:arrow-right"></Icon></LinkDefault>
            </template>
            <template v-if="isLoggedIn" #mobile>
                <LinkDefault class="mx-5 p-3" to="/dashboard">Dashboard</LinkDefault>
                <LinkDefault class="mx-5 p-3" to="/settings">Settings</LinkDefault>
                <LinkDefault class="mx-5 p-3" to="/auth/logout">Logout</LinkDefault>
            </template>
        </NavNavbar>
        <slot></slot>
    </div>
</template>
<style>
    #amplible-main {
        background: radial-gradient(circle at 50% 100%, #292e3d, #252a3a, #212737, #1d2334, #1a2030, #171d2d, #141a2a, #111727);
    }
</style>