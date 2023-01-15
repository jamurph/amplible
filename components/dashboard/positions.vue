<script setup>

    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const initializing = ref(true)
    const error = ref(false)
    const positions = ref([])

    onMounted(async ()=> {
        if(user.value){
            try{
                let response = await supabase.from('positions').select('*').eq('user_id', user.value.id).eq('is_archived', false)
                positions.value = response.data
                initializing.value = false
            } catch (er){
                error.value = er
            }
        }
    })


</script>

<template>
    
    <LoadingSpinner v-if="initializing"/>
    <div v-else class="mt-8">
        <template v-if="positions.length > 0">
            <h2 class="text-3xl">Your Active Positions:</h2>
            <small v-if="error" class="text-sm mt-1 text-red-400 block text-center">{{ error }}. <br/>Please refresh.</small>
            <div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid gap-5 mt-5">
                <div class="h-full" v-for="position in positions" :key="position.id">
                    <div class="bg-dark-light10 p-5 rounded-xl shadow-2xl border border-primary h-full flex flex-col">
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
        </template>
        <div class="mt-14">
            <NuxtLink to="/position/new">
                <ButtonPrimary class="block w-72 max-w-full py-5 text-xl rounded-2xl mx-auto">
                    Add New Position <Icon name="fa6-solid:plus"></Icon>
                </ButtonPrimary>
            </NuxtLink>
        </div>
    </div>



</template>