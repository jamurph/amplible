<script setup>


    const route = useRoute()
    const qaTree = ref([])
    const position = ref({})

    const {data, pending, error} = await useLazyFetch(() => `/api/behavioral-interview/${route.params.id}`, {
        server: false,
        headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
    })
    watch(data, (newValue) => {
        if(newValue.qaTree){
            qaTree.value = newValue.qaTree
        }
        if(newValue.position){
            position.value = newValue.position
        }
    })

    const currentQuestionIndex = ref(0) //NOTE: assumed to be == to the "order" field.
    const lastQuestionIndex = computed(() => {
        if(qaTree.value){
            return qaTree.value.length - 1
        } else {
            return 0
        }
    })

    const shownQuestions = computed(() => {
        if(!qaTree.value) return []

        let lastShownIndex = qaTree.value.findLastIndex((q)=> q.skipped || q.behavioral_interview_question_answer.length > 0 || q.behavioral_interview_question_advice.length > 0)
        if(lastShownIndex === qaTree.value.length - 2){
            return qaTree.value //show all
        } else {
            return qaTree.value.slice(0, lastShownIndex + 2)
        }
    })

    function setSkipped(question_id, skipped){
        qaTree.value.find((q)=> q.id === question_id).skipped = skipped
    }

    function setAdvice(question_id, advice){
        qaTree.value.find((q)=> q.id === question_id).behavioral_interview_question_advice.push({text: advice})
    }

    function addAnswer(question_id, answer, order, critique){
        qaTree.value.find((q)=> q.id === question_id).behavioral_interview_question_answer.push({text: answer, order: order, behavioral_interview_question_answer_critique: [{text: critique}]})
    }

    
</script>

<template>
    <div class="md:max-w-5xl md:mx-auto mx-3 p-4">
        <LoadingSpinner class="text-primary" v-if="pending" message="INITIALIZING AI" />
        <ErrorAlert v-else-if="error">
            <p>We ran into an error. Please refresh.</p>
        </ErrorAlert>
        <template v-else>
            <h1 class="text-4xl text-center mb-1">Behavioral Interview Prep</h1>
            <small class="text-sm text-center block text-light-dark20">for</small>
            <h2 class="text-xl text-center">{{ position.title }} at {{ position.company_name }}</h2>

            <hr class="border-dark-light20 my-20"/>
            <PrepBehavioralInterviewQuestion v-for="question in shownQuestions"  @set-skipped="setSkipped" @set-advice="setAdvice" @add-answer="addAnswer" :key="question.id" :question="question" />
        </template>
    </div>
</template>
