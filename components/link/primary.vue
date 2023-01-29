<script setup>
    const props = defineProps(['to'])
</script>

<template>
    <NuxtLink v-if="props.to" :to="props.to" class="text-primary-dark20 hover:text-primary transition-all duration-300 hover:cursor-pointer"><slot>Click Here</slot></NuxtLink>
    <span v-else class="text-primary-dark20 hover:text-primary transition-all duration-300 hover:cursor-pointer"><slot>Click Here</slot></span>
</template>