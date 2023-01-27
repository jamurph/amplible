<script setup>

    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const initializing = ref(true)
    const error = ref(false)
    const prep_types = ref([])

    const props = defineProps(['position_id'])

    onMounted(async ()=> {
        if(user.value){
            try{
                let response = await supabase.from('preparation_types').select('*').eq('requires_position', true).eq('is_active', true).order('name')
                prep_types.value = response.data
                initializing.value = false
            } catch (er){
                error.value = er
            }
        }
    })


</script>


<template>
    
    <small v-if="error" class="text-sm mt-1 text-red-400 block text-center">{{ error }}. <br/>Please refresh.</small>
    <LoadingSpinner v-if="initializing"/>
    <div v-else class="mt-8">
        <template v-if="prep_types.length > 0">
            <div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid gap-5 mt-5">
                <div class="h-full" v-for="prep_type in prep_types" :key="prep_type.id">
                    <div class="bg-dark-light10 p-5 rounded-xl shadow-lg border border-secondary h-full flex flex-col">
                        <div class="text-2xl font-bold">
                            {{ prep_type.name }}
                        </div>
                        <div class="text-sm mt-3 text-light-dark20 flex-grow">
                            {{ prep_type.description }}
                        </div>
                        <div class="block text-right mt-8">
                            <NuxtLink :to="`${prep_type.page_route.replace('{position}', props.position_id)}`"><ButtonSecondary >Start Prep <Icon name="fa6-solid:arrow-right"></Icon></ButtonSecondary></NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="h-full">
                    <div class="bg-dark-light10 p-5 rounded-xl shadow-lg border border-dark-light20 h-full flex flex-col justify-center">
                        <div class="text-2xl text-center font-bold">
                            More Coming Soon!
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>