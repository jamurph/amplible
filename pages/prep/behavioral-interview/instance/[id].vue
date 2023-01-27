<script setup>


    const route = useRoute()

    const {data,pending,error} = await useLazyFetch(() => `/api/behavioral-interview/${route.params.id}`, {
        server: false,
        headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
    })

    
</script>

<template>
    <div class="md:max-w-5xl md:mx-auto mx-3 p-4">
        <LoadingSpinner v-if="pending" />
        <ErrorAlert v-else-if="error">
            <p>We ran into an error. Please refresh.</p>
        </ErrorAlert>
        <template v-else>
            <div v-for="question in data.qaTree">
                 <PrepBehavioralInterviewQuestion :question="question" />
            </div>
        </template>
    </div>
</template>
