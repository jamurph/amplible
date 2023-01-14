<script setup>
import { storeToRefs } from 'pinia';


    definePageMeta({
        middleware: 'confirmed'
    })

    const loading = ref(true)

    const user = useSupabaseUser() 
    const userProfile = useUserProfileStore()

    const {id: user_profile_id,acknowledged_ai, is_onboarded} = storeToRefs(userProfile)
    
    const errorLoading = ref('')

    loading.value = !user_profile_id.value
    watch(user_profile_id, () => {
        loading.value = !user_profile_id.value
    })

   
</script>

<template>
    <div>
        <template v-if="loading">
            <LoadingSpinner></LoadingSpinner>
        </template>
        <template v-else-if="errorLoading">
            <h1>We've encountered an error. Please refresh the page and try again.</h1>
        </template>
        <template v-else>
            <template v-if="!acknowledged_ai">
                <UserAiAcknowledgement />
            </template>
            <template v-else-if="!is_onboarded">
                Onboard time
                <ButtonPrimary @click="acknowledged_ai = false">back to acknowledge</ButtonPrimary>
            </template>
            <template v-else>
                <h1>Welcome, {{ user.email }}</h1>
            </template>
        </template>

    </div>
</template>

<style>

</style>