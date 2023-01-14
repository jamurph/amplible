<script setup>
    //in the future, it would be good to have a more involved onboarding process (potentially)

import { storeToRefs } from 'pinia';

    const userProfile = useUserProfileStore()

    const {is_onboarded} = storeToRefs(userProfile)

    function finishOnboarding(){
        is_onboarded.value = true
    }

</script>
<template>
    <div class="md:max-w-3xl md:mx-auto p-5 mb-32">
        <h1 class="text-4xl text-center mb-8">Welcome to Amplible!</h1>
        <div>
            <p class="text-lg my-3">Interviews can be a nervewracking and stressful experience. You're often expected to give complete and coherent answers to very challenging and open-ended questions. Yet, there are not a lot of ways to get direct feedback on the quality of your answers.</p>
            <p class="text-lg my-3">Amplible provides tools powered by the latest Artificial Intelligence models to give you the direct, real-time feedback you need to improve your answers and increase your chances of landing your dream job &ndash; and you can do it from anywhere and at anytime.</p>
            <hr class="border-dark-light10 my-8" />
            <h3 class="text-2xl text-center mb-5">How It Works</h3>
            <p class="text-lg my-3">Every position is different. Therefore, the first thing to do in Amplible is define what position(s) you are after. Providing information on the company and position gives the AI the context it needs to recommend actions and evaluate your answers.</p>
            <p class="text-lg my-3">Once you've defined a <span class="font-bold text-primary-dark20">Position</span>, you'll be able to select from a list of AI-powered <span class="font-bold text-primary-dark20">Preparation Types</span> to engage in to get yourself ready for that position's interview.</p>
            <p class="text-lg my-3">Pretty Simple!</p>
            <hr class="border-dark-light10 my-8" />
            <h3 class="text-2xl text-center mb-5">Amplible Tokens</h3>
            <p class="text-lg my-3">We want you to land that dream job! Interview preparation is a challenging endeavor that we usually only engage in once every few years.</p>
            <p class="text-lg my-3">Therefore, we don't require a monthly payment for use of Amplible. Instead, you can purchase <span class="font-bold text-primary-dark20">Amplible Tokens</span>, which are only used when Amplible leverages the AI.</p>
            <p class="text-lg my-3">This way, you can be sure you only pay for what you are actively using and getting value out of.</p>
            <hr class="border-dark-light10 my-8" />
            <h3 class="text-2xl text-center mb-5">Setting Personal Defaults</h3>
            <p class="text-lg my-3">When applying for multiple jobs, you might tailor your resume to the specific job &ndash; such as by editing your Objective to better match the company or removing irrelevant skills.</p>
            <p class="text-lg my-3">Whenever you define a <span class="font-bold text-primary-dark20">Position</span>, you'll have the opportunity to tailor your personal details to the position, if needed. To help you with this process, you can define default values at anytime by visiting the <span class="font-bold text-primary-dark20">Settings</span> page.</p>
            <p class="text-lg my-3">If you're ready, go ahead and enter some default values below. You might copy them from your resume. Don't worry about making it perfect! The AI is pretty good at working with what you give it.</p>
            <p class="text-lg my-3">If you ever feel like the AI is focusing too much on certain details, you can always create another <span class="font-bold text-primary-dark20">Position</span> and change the inputs!</p>
        </div>
        <UserSettings />
        
        <h3 class="text-2xl text-center mb-5">Are you ready to land your dream job?</h3>
        <p class="text-lg my-3">Once you've read and understood the above, click the button below to get started preparing to be the best candidate with Amplible!</p>

        <ButtonPrimary class="mx-auto block mt-16"
          type="submit"
          @click="finishOnboarding"
        >
          Let's Get Started!
        </ButtonPrimary>
    </div>
</template>