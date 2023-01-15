<script setup>
const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const initializing = ref(true)
    const error = ref(false)
    const position = ref({})

    const route = useRoute()

    onMounted(async ()=> {
        if(user.value){
            try{
                let response = await supabase.from('positions').select('*').eq('user_id', user.value.id).eq('id', route.params.id).limit(1)
                console.log(response)
                position.value = response.data[0]
                initializing.value = false
            } catch (er){
                error.value = er
            }
        }
    })
</script>
<template>
    <LoadingSpinner v-if="initializing"/>
    <div v-else>
        <div class="container p-4 mx-auto">
            <h2 class="text-4xl text-center mb-2">{{ position.title }}</h2>
            <small class="text-sm text-center block">at</small>
            <h1 class="text-4xl text-center mb-8">{{ position.company_name }}</h1>
            <hr class="border-dark-light20"/>
            <LinkDefault>Edit Details</LinkDefault>
        </div>
    </div>
</template>