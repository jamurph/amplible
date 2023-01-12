<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="#F99969" :height="5"/>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script setup lang="ts">
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - Amplible` : 'Amplible - Interview Prep Supercharged with AI';
    }
  })
</script>

<style lang="scss">
  html {
    font-family: 'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: $dark;
    color: $light;
  }
</style>