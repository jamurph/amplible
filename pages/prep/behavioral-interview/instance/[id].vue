<script setup>

    const loading = ref(true)
    const error = ref('')

    const res = ref({})

    const route = useRoute()

    try {
        const result = await useFetch(`/api/behavioral-interview/${route.params.id}`, {
            headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
        })
        if(result.error.value){
            error.value = result.error.value.message
        } else {
            res.value = result.data.value
            //console.log(res.value)
        }
    }
    catch (er){
        error.value = er
    } finally {
        loading.value = false
    }


    
</script>

<template>
    <div class="container mx-auto p-4">
                

    </div>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error">
        <p>Error: {{ error }}</p>
    </div>
    <div class="container mx-auto p-4" v-else>
        <div v-for="question in res.qaTree" class="question">
            {{ question.text }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .question {
        @apply mb-8;
    }
</style>