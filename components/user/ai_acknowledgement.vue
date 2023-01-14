<script setup>
import { storeToRefs } from 'pinia';
const userProfile = useUserProfileStore()

const {acknowledged_ai} = storeToRefs(userProfile)
</script>

<template>
    <div class="md:max-w-3xl md:mx-auto mb-14">
        <div class="bg-dark-light10 p-6 rounded-lg m-3">
            <h1 class="text-4xl text-center mb-8">Before we begin...</h1>
            <p class="text-lg mb-3">You're almost ready to begin harnessing the power of AI in your interview prep!</p>
            <p class="text-lg">Before you get started, make sure you understand the following:</p>
            <h4 class="text-2xl mt-5"><b>1. Artificial Intelligence has limitations.</b> </h4>
            <p class="text-lg mt-2">While we have tested our AI platform extensively and have taken necessary precautions to ensure our use of AI is resilient, it is crucial to be critical of the information the AI provides. In rare circumstances, the AI is capable of providing misinformation or demonstrating bias in responses. Our AI is a useful tool &ndash; not a substitute for professional advice. </p>
            <h4 class="text-2xl mt-5"><b>2. Your Input Matters</b> </h4>
            <p class="text-lg mt-2">The details you provide our AI influence the type and quality of responses it provides. If you are getting similar responses and questions out of the AI, try altering the information you provide it.</p> 
            <p class="text-lg mt-2">Please note that intentionally passing information aimed at misleading the AI or getting it to perform actions alternative to its designated use is prohibited by our Terms of Service.</p>
            <h4 class="text-2xl mt-5"><b>3. Your Feedback Matters</b> </h4>
            <p class="text-lg mt-2">We'll be continuing to improve our systems. One way you can help us improve is by providing feedback on our AI's responses, particularly when they are especially helpful.</p> 
            
            <ButtonPrimary class="mx-auto block mt-8 mb-8" @click="acknowledged_ai = true">I Understand. Let's get started!</ButtonPrimary>
        </div>
    </div>
</template>