<script setup>

    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const initializing = ref(true)
    const error = ref(false)
    const prep_started = ref([])

    const props = defineProps(['position_id'])

    onMounted(async ()=> {
        if(props.position_id){
            if(user.value){
                try{
                    let response = await supabase.from('preparations').select('*, preparation_types(*)').eq('position_id', props.position_id).eq('user_id', user.value.id).order('created_at', {ascending: false})
                    prep_started.value = response.data
                    initializing.value = false
                } catch (er){
                    error.value = er
                }
            }
        } else {
            //done initializing - just no position prop.
            initializing.value = false;
        }
    })


</script>


<template>
    
    <small v-if="error" class="text-sm mt-1 text-red-400 block text-center">{{ error }}. <br/>Please refresh.</small>
    <LoadingSpinner v-if="initializing"/>
    <div v-else class="mt-8">
        <template v-if="prep_started.length > 0">
            <hr class="border-dark-light20 mb-8"/>
            <h2 class="text-3xl">Your Prep History:</h2>
            <div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid gap-5 mt-5">
                <div class="h-full" v-for="prep in prep_started" :key="prep.id">
                    <div class="bg-dark-light10 p-5 rounded-xl shadow-2xl border border-dark-light20 h-full flex flex-col">
                        <div class="text-2xl font-bold">
                            {{ prep.preparation_types.name }}
                        </div>
                        <div class="text-sm mt-3 text-light-dark20 flex-grow">
                            Created: {{ new Date(prep.created_at).toLocaleString() }}
                        </div>
                        <div class="block text-right mt-8">
                            <NuxtLink :to="`${prep.page_route.replace('{id}', prep.id)}`"><ButtonDefault >View Prep <Icon name="fa6-solid:arrow-right"></Icon></ButtonDefault></NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>