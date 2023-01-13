<template>
  <div>
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
      <link rel="manifest" href="/site.webmanifest">
    </Head>
    <NuxtLayout>
      <NuxtLoadingIndicator color="#F99969" :height="5"/>
      <NuxtPage :key="$route.fullPath"  />
    </NuxtLayout>
  </div>
</template>


<script setup lang="ts">
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - Amplible` : 'Amplible - Interview Prep Supercharged with AI';
    }
  })


  const authClient = useSupabaseAuthClient()
  
  authClient.auth.onAuthStateChange(async (event, session) => {

    console.log(event)
    if(event == "PASSWORD_RECOVERY"){
        await navigateTo('/auth/passwordreset')
    }

  });

</script>

<style lang="scss">
  html {
    font-family: 'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: $dark;
    color: $light;
  }
</style>