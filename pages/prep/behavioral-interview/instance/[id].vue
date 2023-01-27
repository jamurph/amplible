<script setup>


    const route = useRoute()

    const {data,pending,error} = await useLazyFetch(() => `/api/behavioral-interview/${route.params.id}`, {
        server: false,
        headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
    })

    
</script>

<template>
    <div class="container mx-auto p-4">
        <LoadingSpinner v-if="pending" />
        <div v-else-if="error">
            <p>We ran into an error. Please refresh.</p>
        </div>
        <template v-else>
            <div v-for="question in data.qaTree">
                 <PrepBehavioralInterviewQuestion :question="question" />
            </div>
        </template>
    </div>
</template>
