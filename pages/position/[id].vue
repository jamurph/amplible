<script setup>

    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const initializing = ref(true)
    const error = ref(false)
    const position = ref({})
    const isUpdating = ref(false)

    const route = useRoute()

    const archiveLink = computed(()=> {
        return position.value.is_archived ? 'Unarchive Position' : 'Archive Position'
    })

    onMounted(async ()=> {
        if(user.value){
            try{
                let response = await supabase.from('positions').select('*').eq('user_id', user.value.id).eq('id', route.params.id).limit(1)
                position.value = response.data[0]
                initializing.value = false
            } catch (er){
                error.value = er
            }
        }
    })

    async function toggleArchived(){
        if(position.value.id && !isUpdating.value){
            isUpdating.value = true
            let response = await supabase.from('positions').update(
                {
                    is_archived: !position.value.is_archived
                }
            ).eq('user_id', position.value.user_id).eq('id', position.value.id).select('*')
            console.log(response)
            if( response.error){
                isUpdating.value = false
                throw new Error(response.error)
            } else {
                position.value = response.data[0]
            }
        }
        isUpdating.value = false
    }
</script>
<template>
    <LoadingSpinner v-if="initializing"/>
    <div v-else>
        <div class="container p-4 mx-auto">
            <h2 class="text-4xl text-center mb-2">{{ position.title }}</h2>
            <small class="text-sm text-center block">at</small>
            <h1 class="text-4xl text-center mb-8">{{ position.company_name }}</h1>
            <div class="md:text-right text-center">
                <LinkDefault :to="`/position/edit/${position.id}`" class="inline-block m-3 text-sm">Edit Position</LinkDefault>
                <LinkDefault @click="toggleArchived" class="inline-block m-3 text-sm">{{ archiveLink }}</LinkDefault>
            </div>
            <hr class="border-dark-light20"/>
        </div>
    </div>
</template>