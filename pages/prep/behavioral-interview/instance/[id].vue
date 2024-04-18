<script setup>


    const route = useRoute()
    const qaTree = ref([])
    const position = ref({})

    const showNext = ref(false)

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

    

    const showButton = computed(()=>{
        //show if the last question shown has an answer and the last question shown is not the very last question
        return shownQuestions.value[shownQuestions.value.length - 1].behavioral_interview_question_answer.length > 0 && shownQuestions.value.length != qaTree.value.length
    })

    const showFinished = computed(()=> {
        //show if we are showing all questions, and the last question has an answer or is skipped.
        return shownQuestions.value.length === qaTree.value.length && (shownQuestions.value[shownQuestions.value.length - 1].behavioral_interview_question_answer.length > 0 || shownQuestions.value[shownQuestions.value.length - 1].skipped)
    })

    const shownQuestions = computed(() => {
        if(!qaTree.value) return []

        let lastShownIndex = qaTree.value.findLastIndex((q)=> q.skipped || q.behavioral_interview_question_answer.length > 0 || q.behavioral_interview_question_advice.length > 0)

        if(lastShownIndex === -1){
            lastShownIndex = 0;
        }

        if(lastShownIndex === qaTree.value.length - 1){
            return qaTree.value //show all
        } else {
            //if the last one was skipped, we show the next one automatically.
            if(qaTree.value[lastShownIndex].skipped || showNext.value){
                if(lastShownIndex === qaTree.value.length - 2){
                    return qaTree.value
                }
                else {
                    return qaTree.value.slice(0, lastShownIndex + 2)
                }
            } else {
                return qaTree.value.slice(0, lastShownIndex + 1)
            }
        }
    })

    function nextQuestion(){
        showNext.value = true
    }

    function setSkipped(question_id, skipped){
        showNext.value = false
        qaTree.value.find((q)=> q.id === question_id).skipped = skipped
    }

    function setAdvice(question_id, advice){
        showNext.value = false
        const question = qaTree.value.find((q)=> q.id === question_id)
        if(question.behavioral_interview_question_advice.length === 0) {
            question.behavioral_interview_question_advice.push({text: advice})
        }else {
            question.behavioral_interview_question_advice[0] = {text: advice}
        }
    }

    function addAnswer(question_id, answer_id, answer, order, critique){
        showNext.value = false
        qaTree.value.find((q)=> q.id === question_id).behavioral_interview_question_answer.push({id: answer_id, text: answer, order: order, behavioral_interview_question_answer_critique: [{text: critique}]})
    }

    
</script>

<template>
    <div class="md:max-w-5xl md:mx-auto p-3 pb-20">
        <LoadingSpinner class="text-primary" v-if="pending" message="INITIALIZING AI" />
        <ErrorAlert v-else-if="error">
            <p>We ran into an error. Please refresh.</p>
        </ErrorAlert>
        <template v-else>
            <h1 class="text-4xl text-center mb-1">Behavioral Interview Prep</h1>
            <small class="text-sm text-center block text-light-dark20">for</small>
            <h2 class="text-xl text-center">{{ position.title }} at {{ position.company_name }}</h2>

            <hr class="border-dark-light20 my-20"/>
            <TransitionGroup name="questions" tag="div">
                <PrepBehavioralInterviewQuestion v-for="question in shownQuestions"  @set-skipped="setSkipped" @set-advice="setAdvice" @add-answer="addAnswer" :key="question.id" :question="question" />
            </TransitionGroup>
            <div class="my-5 text-center" v-if="showButton"><ButtonPrimary @click="nextQuestion" class="inline-block w-72 max-w-full py-5 text-xl rounded-2xl">Next Question</ButtonPrimary></div>
            <div class="text-center text-2xl" v-if="showFinished">
                You've completed this prep!<br/><br/>
                <LinkPrimary :to="`/position/${position.id}`">Ready for another?</LinkPrimary>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.questions-enter-active,
.questions-leave-active {
  transition: all 0.7s ease;
}
.questions-enter-from,
.questions-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

</style>