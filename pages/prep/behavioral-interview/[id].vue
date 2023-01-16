<script setup>

    const route = useRoute()


    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const position = ref({})
    const initializing = ref(true)
    const error = ref('')

    const launched = ref(false)
    const created_instance_id = ref('')

    watchEffect(async () => {
        if(created_instance_id.value){
            await navigateTo(`/prep/behavioral-interview/instance/${created_instance_id.value}`)
        }
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



    async function launchPrep(){
        launched.value = true
        try {
            const result = await useFetch(`/api/behavioral-interview`, {
                method: 'POST',
                body: {
                    position: position.value.id
                },
                headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
            })
            if(result.error.value){
                error.value = result.error.value.message
            } else {
                //navigate to instance
                created_instance_id.value = result.data.value.created_instance_id
            }
        }
        catch (er){
            error.value = er
        }
    
    }

    const truncate = (s) => s.length > 30 ? s.slice(0, 27) + "..." : s;
</script>

<template>
    <div class="container mx-auto p-4">
        <template v-if="!initializing">
            <h2 class="text-sm text-center text-light-dark20 font-bold mb-2">{{ truncate(position.title) }} at {{ truncate(position.company_name) }}</h2>
            <h1 class="text-4xl text-center mb-8">Behavioral Interview Prep</h1>
            <div class="md:max-w-3xl md:mx-auto mx-3">
                <p class="text-lg my-3">Are you preparing for a behavioral interview and feeling a little nervous about it? Don't worry, you've come to the right place!</p>
                <p class="text-lg my-3">Behavioral interviews are designed to give your potential employer a better understanding of how you handle certain situations and how you're likely to handle similar situations in the future. This type of interview is an opportunity for you to demonstrate how your past experiences and skills align with the requirements of the job you're applying for.</p>
                <p class="text-lg my-3">But, to make the most of this opportunity, it's crucial that you prepare well in advance. By thinking about specific examples from your past, you'll be able to showcase your qualifications and strengths in a tangible way that will impress your interviewer. With the right preparation, you'll be able to feel confident and make a great impression, setting you up for success in the hiring process.</p>
                <hr class="border-dark-light20 my-8"/>
                <p class="text-lg my-3">In this Prep Module, our AI will guide you through personalized behavioral interview questions based on your details and the requirements of this position.</p>
                <p class="text-lg my-3">While you should attempt to answer each question to the best of your ability, don't stress it! Think of your initial attempts to answer these challenging questions as rough drafts &ndash; they don't need to be perfect.</p>
                <p class="text-lg my-3">The AI will provide detailed feedback on each answer and give you tips for improvement.</p>
                <div class="text-center mt-8 mb-32">
                    <LoadingSpinner v-if="launched" />
                    <ButtonPrimary v-else @click="launchPrep">Begin Prep <Icon name="fa6-solid:arrow-right"></Icon></ButtonPrimary>
                </div>
            </div>
            <small v-if="error" class="text-sm mt-1 text-red-400 block text-center">{{ error }}. <br/>Please refresh.</small>
        </template>
        <template v-else>
            <LoadingSpinner />
            <small v-if="error" class="text-sm mt-1 text-red-400 block text-center">{{ error }}. <br/>Please refresh.</small>
        </template>
    </div>
</template>