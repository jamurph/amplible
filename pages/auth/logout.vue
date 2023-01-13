<script setup>
    definePageMeta({
        pageTransition: false
    })

    const user = useSupabaseUser()
    const client = useSupabaseAuthClient()
    const error = ref('')

    /* must run client-side. */
    onBeforeMount( async () => {

        watchEffect(async ()=>{
            if(!user.value?.id){
                await navigateTo('/')
            }
        })

        if (user.value?.id){
            const {logoutError} = await client.auth.signOut()
            if(logoutError){
                error.value = logoutError
            }
        }
    } )

    

</script>

<template>
<div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
      <h2 class="text-3xl text-center mb-2">Logging out...</h2>
      <small v-if="error" class="text-sm mt-3 text-center text-red-400 block">{{ error }}</small>
</div>
</template>