<script setup>
    const props = defineProps(['to'])
</script>
<template>
    <NuxtLink v-if="props.to" :to="props.to" class="text-secondary-dark20 hover:text-secondary transition-all duration-300 hover:cursor-pointer"><slot>Click Here</slot></NuxtLink>
    <span v-else class="text-light-dark20 hover:text-light transition-all duration-300 hover:cursor-pointer"><slot>Click Here</slot></span>
</template>