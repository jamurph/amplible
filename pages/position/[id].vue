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
        {{ position.company_name }}
    </div>
</template>