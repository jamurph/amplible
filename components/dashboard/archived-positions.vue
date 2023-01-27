<script setup>

    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const initializing = ref(true)
    const error = ref(false)
    const positions = ref([])

    onMounted(async ()=> {
        if(user.value){
            try{
                let response = await supabase.from('positions').select('*').eq('user_id', user.value.id).eq('is_archived', true).order('created_at', {ascending: false})
                positions.value = response.data
                initializing.value = false
            } catch (er){
                error.value = er
            }
        }
    })

    const show = ref(false)
    function toggleArchived(){
        show.value = !show.value;
    }

</script>

<template>
    
    <LoadingSpinner v-if="initializing"/>
    <div v-else class="mt-16">
        <template v-if="positions.length > 0">
            <div class="text-right">
                <LinkDefault @click="toggleArchived" class="text-sm" >{{ show ? 'Hide Archived Positions' : 'Show Archived Positions'}}</LinkDefault>
            </div>
            <div class="pb-16" v-if="show">
                <hr class="border-dark-light20 mb-8"/>
                <h2 class="text-3xl">Your Archived Positions:</h2>
                <small v-if="error" class="text-sm mt-1 text-red-400 block text-center">{{ error }}. <br/>Please refresh.</small>
                <div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid gap-5 mt-5">
                    <div class="h-full" v-for="position in positions" :key="position.id">
                        <div class="bg-dark-light10 p-5 rounded-xl shadow-lg border border-dark-light20 h-full flex flex-col">
                            <div class="text-lg text-light-dark20">
                                {{ position.title }}
                            </div>
                            <div class="text-2xl font-bold">
                                {{ position.company_name }}
                            </div>
                            <div class="text-sm mt-3 text-light-dark20 flex-grow">
                                {{ position.company_description }}
                            </div>
                            <div class="block text-right mt-8">
                                <NuxtLink :to="`/position/${position.id}`"><ButtonDefault >View Position <Icon name="fa6-solid:arrow-right"></Icon></ButtonDefault></NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>



</template>