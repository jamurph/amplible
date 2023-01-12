<script setup>

    const router = useRouter()
    const client = useSupabaseAuthClient();

    client.auth.signOut();

    router.push('/');


</script>

<template>
<div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
      <h2 class="text-3xl text-center mb-2">Logging out...</h2>
</div>
</template>