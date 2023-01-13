<script setup>
    const user = useSupabaseUser()
    const supabase = useSupabaseAuthClient()

    watchEffect(() => {
        if(user?.value?.email_confirmed_at){
            navigateTo('/dashboard')
        }
    })


</script>

<template>
<div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
      <h2 class="text-3xl text-center mb-2">Email Confirmation</h2>
      <p class="mt-5">An email confirmation has been sent. Please allow a few minutes for it to reach your inbox. If you do not see the email after several minutes, check your Spam folder.</p>
</div>
</template>