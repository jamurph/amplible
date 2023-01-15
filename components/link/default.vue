<script setup>
    const props = defineProps(['to'])
</script>

<template>

    <NuxtLink class="text-light-dark20 hover:text-light transition-all duration-300 hover:cursor-pointer" v-if="props.to" :to="props.to"><slot>Click Here</slot></NuxtLink>
    <span v-else class="text-light-dark20 hover:text-light transition-all duration-300 hover:cursor-pointer"><slot>Click Here</slot></span>

</template>