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
            <ErrorAlert>We've encountered an error. Please refresh the page and try again.</ErrorAlert>
        </template>
        <template v-else>
            <template v-if="!acknowledged_ai">
                <UserAiAcknowledgement />
            </template>
            <template v-else-if="!is_onboarded">
                <UserOnboarding />
            </template>
            <template v-else>
                <div class="container p-4 mx-auto">
                    <h1 class="text-4xl text-center mb-8">Dashboard</h1>
                    <hr class="border-dark-light20"/>
                    <DashboardPositions/>
                    <DashboardArchivedPositions />
                    <hr class="border-dark-light20"/>
                </div>
            </template>
        </template>

    </div>
</template>

<style>

</style>