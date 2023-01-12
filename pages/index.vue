<script setup>

definePageMeta({
  title: 'Interview Prep Supercharged By AI',
  description: 'Get personalized, real-time feedback on your interview responses and improve your chances of landing your dream job with the help of our AI-powered platform.'
})

</script>

<template>
    <div>
        <div class="container mx-auto text-center max-w-3xl p-2">
            <h1 class="text-3xl lg:font-normal sm:font-bold mt-20">Be The Best Candidate With Interview Prep Supercharged by Artificial Intelligence</h1>
            <p class="my-8">Get personalized, real-time feedback on your interview responses and improve your chances of landing your dream job with the help of our AI-powered platform.</p>
            <NuxtLink to="/auth/signup">
                <ButtonPrimary class="mx-3">Get Started <Icon name="fa6-solid:user-plus" class="ml-3"></Icon></ButtonPrimary>
            </NuxtLink>
            <NuxtLink class="inline-block p-5 m-2 text-primary-dark20 hover:text-primary transition-all duration-300" to="/about/howitworks">How it works <Icon name="fa6-solid:arrow-right"></Icon></NuxtLink>

        </div>
  </div>
</template>

<style scoped>

</style>