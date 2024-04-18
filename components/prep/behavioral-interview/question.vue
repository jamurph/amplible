<script setup>
import { maxLength, helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'


const props = defineProps(['question'])
const emit = defineEmits(['setSkipped', 'setAdvice', 'addAnswer'])

const sortedAnswers = computed(() => {
    return props.question.behavioral_interview_question_answer.sort((a, b) => {
        return (a.order > b.order) ? 1 : -1
    })
})


/*

    - still not always perfectly using "you"
    - would be nice to have a better loading indicator for initial setup. Maybe a check route first? Then we could explain what is going on behind the scenes.
    - question generation - adjust to keep each question hyper-specific. e.g. no questions like "Explain how you've used X, y, z , a ,b , and c"
            -same with advice. Add tweak to prompt to avoid long lists.
*/


const settingSkipped = ref(false)
const skippingError = ref('')

const gettingAdvice = ref(false)
const adviceError = ref('')

const gettingCritique = ref(false)
const critiqueError = ref('')

const tryingAgain = ref(false)

const formData = reactive({
    answer: ''
})

const rules = computed(() => {
    return {
        answer: {
            maxLength: helpers.withMessage('Unfortunately, this answer is too long for the AI. Your answers in a real interview will likely need to be shorter than this, too!', maxLength(3000)),
            required: helpers.withMessage('You need to fill out an answer before you submit!', required)
        }
    }
})

const v$ = useVuelidate(rules, formData)

async function submitAnswer() {
    v$.value.$validate();
    if (!v$.value.$error) {
        if (!gettingCritique.value) {
            gettingCritique.value = true
            const order = props.question.behavioral_interview_question_answer.length
            const answer = formData.answer
            try {
                const result = await useFetch(() => `/api/behavioral-interview/question/answer/${props.question.id}`, {
                    method: 'POST',
                    body: {
                        order: order,
                        answer: answer
                    },
                    headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
                })
                if (result.error.value) {
                    critiqueError.value = result.error.value.message
                } else {
                    critiqueError.value = ''
                    tryingAgain.value = false
                    formData.answer = ''
                    v$.value.$reset()
                    //emit event to parent, so that it can update the qaTree.
                    const critique = result.data.value.text
                    const answer_id = result.data.value.id
                    emit('addAnswer', props.question.id, answer_id, answer, order, critique)
                }
            }
            catch (er) {
                critiqueError.value = er
            } finally {
                gettingCritique.value = false
            }
        }
    }
}



async function setSkipped(skipped) {
    if (!settingSkipped.value) {
        settingSkipped.value = true
        try {
            const result = await useFetch(() => `/api/behavioral-interview/question/${props.question.id}`, {
                method: 'POST',
                body: {
                    skipped: skipped
                },
                headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
            })
            if (result.error.value) {
                skippingError.value = result.error.value.message
            } else {
                skippingError.value = ''
                //emit event to parent, so that it can update the qaTree.
                emit('setSkipped', props.question.id, skipped)
            }
        }
        catch (er) {
            skippingError.value = er
        } finally {
            settingSkipped.value = false
        }
    }
}


async function advise() {
    if (!gettingAdvice.value) {
        gettingAdvice.value = true
        try {

            const result = await fetch(`/api/behavioral-interview/question/advise/${props.question.id}`, {
                method: 'GET',
                headers: useRequestHeaders(['cookie']) //necessary for serverSupabase
            })

            if (result.ok) {
                adviceError.value = ''
                const reader = result.body.getReader()
                const decoder = new TextDecoder()
                let done = false
                while (!done) {
                    const { value, done: doneReading } = await reader.read()
                    done = doneReading

                    const chunkValue = decoder.decode(value)

                    const text = chunkValue

                    const current = props.question.behavioral_interview_question_advice.length > 0 ? props.question.behavioral_interview_question_advice[0].text : ''
                    //emit event to parent, so that it can update the qaTree.
                    emit('setAdvice', props.question.id, current + text)

                }
            } else {
                console.log('Not OK response')
                adviceError.value = result.error.value.message
            }
        }
        catch (er) {
            console.log("errored response.")
            adviceError.value = er
        } finally {
            gettingAdvice.value = false
        }
    }
}

</script>

<template>
    <div class="mb-16">
        <div class="bg-dark-light10 md:py-6 md:px-10 p-4 rounded-lg text-lg shadow-lg">
            <h4 class="text-xl">{{ props.question.text }}</h4>
            <div v-if="!props.question.skipped">
                <hr class="border-dark-light20 mt-3" />
                <Transition appear>
                    <div v-if="props.question.behavioral_interview_question_advice.length > 0"
                        class="whitespace-pre-line break-words advice-bg shadow-2xl mt-3 px-4 py-6  border-t-4 rounded-lg border-secondary text-base">
                        <div class="font-bold text-lg mb-3">Answer Advice:</div>
                        {{ props.question.behavioral_interview_question_advice[0].text }}
                    </div>
                </Transition>
                <LinkPrimary
                    v-if="props.question.behavioral_interview_question_advice.length === 0 && props.question.behavioral_interview_question_answer.length === 0 && !gettingCritique"
                    class="inline-block mt-3 text-sm" @click="advise">
                    {{ gettingAdvice ? 'Loading...' : 'Get Answer Advice' }}
                </LinkPrimary>
                <small v-if="adviceError" class="text-sm mt-1 text-red-400 block">{{ adviceError }}</small>
                <TransitionGroup appear tag="div">
                    <div v-for="answer in sortedAnswers" :key="answer.id">
                        <div
                            class="whitespace-pre-line break-words answer-bg shadow-2xl mt-3 px-4 py-6  border-r-4 rounded-lg border-primary text-base">
                            <div class="font-bold text-lg mb-3">Answer:</div>
                            {{ answer.text }}
                        </div>
                        <div
                            class="whitespace-pre-line break-words critique-bg shadow-2xl mt-3 px-4 py-6  border-l-4 rounded-lg border-secondary text-base">
                            <div class="font-bold text-lg mb-3">Critique:</div>
                            {{ answer.behavioral_interview_question_answer_critique[0].text }}
                        </div>
                    </div>
                </TransitionGroup>
                <textarea v-if="props.question.behavioral_interview_question_answer.length === 0 && !gettingCritique"
                    class="rounded mt-6 p-2 w-full text-dark bg-light border-2" name="answer"
                    placeholder="Give it your best shot!" v-model="formData.answer" :class="{
                'border-red-400 border-2': v$.answer.$error,
            }" maxlength="3000" rows="5"></textarea>
                <Transition appear>
                    <div v-if="gettingCritique && !tryingAgain"
                        class="whitespace-pre-line break-words answer-bg shadow-2xl mt-3 px-4 py-6  border-r-4 rounded-lg border-primary text-base">
                        <div class="font-bold text-lg mb-3">Answer:</div>
                        {{ formData.answer }}
                    </div>
                </Transition>
                <Transition appear>
                    <div class="text-right my-4"
                        v-if="!gettingCritique && props.question.behavioral_interview_question_answer.length === 0">
                        <LinkDefault class="mt-3 inline-block text-sm mr-8" @click="() => setSkipped(true)">
                            {{ settingSkipped ? 'Loading...' : 'Skip' }}</LinkDefault>
                        <ButtonPrimary class="inline-block" @click="submitAnswer">Submit</ButtonPrimary>
                    </div>
                </Transition>
                <div class="text-right my-4"
                    v-if="props.question.behavioral_interview_question_answer.length > 0 && !tryingAgain && !gettingCritique">
                    <ButtonDefault class="inline-block" @click="tryingAgain = true">Try Another Answer</ButtonDefault>
                </div>
                <Transition appear>
                    <div v-if="tryingAgain">
                        <textarea v-if="!gettingCritique" class="rounded mt-6 p-2 w-full text-dark bg-light border-2"
                            name="answer" placeholder="Give it your best shot!" v-model="formData.answer" :class="{
                'border-red-400 border-2': v$.answer.$error,
            }" maxlength="3000" rows="5"></textarea>
                        <div v-if="gettingCritique"
                            class="whitespace-pre-line break-words answer-bg shadow-2xl mt-3 px-4 py-6  border-r-4 rounded-lg border-primary text-base">
                            <div class="font-bold text-lg mb-3">Answer:</div>
                            {{ formData.answer }}
                        </div>
                        <div class="text-right my-4" v-if="!gettingCritique">
                            <ButtonPrimary class="inline-block" @click="submitAnswer">Submit</ButtonPrimary>
                        </div>
                    </div>
                </Transition>
                <LoadingSpinner v-if="gettingCritique" message="AI Processing" />
                <small v-if="v$.answer.$error" class="text-sm mt-1 text-red-400 block">{{ v$.answer.$errors[0].$message
                    }}</small>
                <small v-if="critiqueError" class="text-sm mt-1 text-red-400 block">Error connecting to the server.
                    Please refresh the page or try again.</small>
                <small v-if="skippingError" class="text-sm mt-1 text-red-400 block text-center">Error connecting to the
                    server. Please refresh this page.</small>
                <small v-if="critiqueError" class="text-sm mt-1 text-red-400 block text-center">Error connecting to the
                    server. Please refresh this page.</small>
            </div>
        </div>
        <div class="pt-1 text-sm text-light-dark20">
            <div class="sm:pl-16 pt-1 text-sm text-light-dark20 inline-block mb-1 sm:mb-0"
                v-if="props.question.skipped">
                You skipped this question. <LinkDefault class="pl-4" @click="() => setSkipped(false)">{{ settingSkipped
                ?
                'Loading...' : 'Unskip' }}</LinkDefault>
                <small v-if="skippingError" class="text-sm mt-1 text-red-400 block text-center">Error connecting to the
                    server. Please refresh this page.</small>
            </div>
            <div class="sm:inline-block sm:float-right">
                <LinkDefault class="">Feedback?</LinkDefault>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.critique-bg {
    background: linear-gradient(-90deg, $dark, lighten($dark, 3%));
}

.answer-bg {
    background: linear-gradient(90deg, $dark, lighten($dark, 3%));
}

.advice-bg {
    background: linear-gradient(0deg, $dark, lighten($dark, 6%));
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>