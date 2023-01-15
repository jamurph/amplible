<script setup>
    import { maxLength, required, helpers } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import { storeToRefs } from 'pinia';

    const userProfile = useUserProfileStore()
    const supabase = useSupabaseClient()
    const {initialized} = storeToRefs(userProfile)
    const supabaseError = ref('')

    const done = ref(false)
    watchEffect(async ()=>{
        if(done.value){
            await navigateTo('/dashboard') //TODO: navigate to the newly created position.
        }
    })


    const formData = reactive({
        companyName : '',
        companyDescription : '',
        positionTitle : '',
        positionDescription : '',
        positionRequirements : '',
        objective: '',
        education: '',
        experience: '',
        skills: '',
    })

    const rules = computed(() => {
        return {
            companyName : {
                required : helpers.withMessage('A company name is required.', required), 
                maxLength : helpers.withMessage('Too long!', maxLength(200)) 
            },
            companyDescription : {
                required : helpers.withMessage('A company description is required.', required), 
                maxLength : helpers.withMessage('Too long!', maxLength(500))
            },
            positionTitle : {
                required : helpers.withMessage('A position title is required.', required), 
                maxLength : helpers.withMessage('Too long!', maxLength(100))
            },
            positionDescription : {
                required : helpers.withMessage('A position description is required.', required), 
                maxLength : helpers.withMessage('Too long!', maxLength(1500))
            },
            positionRequirements : {
                maxLength : helpers.withMessage('Too long!', maxLength(2500)) 
            },
            objective : {
                maxLength : helpers.withMessage('Too long!', maxLength(500)) 
            },
            education : {
                maxLength : helpers.withMessage('Too long!', maxLength(1000)) 
            },
            experience : {
                maxLength : helpers.withMessage('Too long!', maxLength(3000))
            },
            skills : {
                maxLength : helpers.withMessage('Too long!', maxLength(1000))
            },
        }
    })

    const isLoading = ref(false)

    const v$ = useVuelidate(rules, formData)

    watchEffect(()=> {
        if(initialized){
            formData.objective = userProfile.objective
            formData.education = userProfile.education
            formData.experience = userProfile.experience
            formData.skills = userProfile.skills
        }
    })


    async function submitForm(){
        isLoading.value = true

        v$.value.$validate();
        if(!v$.value.$error){

            try{
                const {error} = await supabase.from('positions').insert({
                    user_id: userProfile.id,
                    company_name: formData.companyName,
                    company_description: formData.companyDescription,
                    title: formData.positionTitle,
                    description: formData.positionDescription,
                    requirements: formData.positionRequirements,
                    objective: formData.objective,
                    education: formData.education,
                    experience: formData.experience,
                    skills: formData.skills,
                })

                if(error){
                    supabaseError.value = error
                } else {
                    done.value = true
                }

            } catch (er) {
                supabaseError.value = er;
            }
        }

        isLoading.value = false;
    }
</script>
<template>
    <div class="pb-32">
        <h2 class="text-4xl text-center mb-2">New Position</h2>
        <LoadingSpinner v-if="!initialized" />
        <form v-else @submit.prevent="submitForm">
            <div class="md:max-w-4xl md:mx-auto mx-3 mt-16">
                <LinkDefault to="/dashboard" ><Icon name="fa6-solid:arrow-left"></Icon> Cancel</LinkDefault>
            </div>
            <div class="bg-dark-light10 p-8 py-16 md:max-w-4xl md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-8 shadow-2xl mb-16" >
                <h2 class="text-2xl text-center mb-2">Position Details</h2>
                <p class="text-lg">Enter the details for the company and position you are applying for. You can often copy this straight from the job posting.</p>
                <p class="text-lg my-3">For best results, make sure to remove any irrelevant information or fluff.</p>
                <label class="block mb-8 mt-8" for="companyName">
                    Company Name:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="companyName"
                        placeholder="What is the company called?"
                        v-model="formData.companyName"
                        maxlength="200"
                        rows="1"
                        :class="{
                            'border-red-400 border-2': v$.companyName.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.companyName.$error" class="text-sm mt-1 text-red-400 block">{{ v$.companyName.$errors[0].$message }}</small>
                </label>
                <label class="block mb-8 mt-8" for="companyDescription">
                    Company Description:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="companyDescription"
                        placeholder="What does the company do?"
                        v-model="formData.companyDescription"
                        maxlength="500"
                        rows="2"
                        :class="{
                            'border-red-400 border-2': v$.companyDescription.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.companyDescription.$error" class="text-sm mt-1 text-red-400 block">{{ v$.companyDescription.$errors[0].$message }}</small>
                </label>
                <label class="block mb-8 mt-8" for="title">
                    Position Title:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="title"
                        placeholder="What is this role's title?"
                        v-model="formData.positionTitle"
                        maxlength="100"
                        rows="1"
                        :class="{
                            'border-red-400 border-2': v$.positionTitle.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.positionTitle.$error" class="text-sm mt-1 text-red-400 block">{{ v$.positionTitle.$errors[0].$message }}</small>
                </label>
                <label class="block mb-8 mt-8" for="description">
                    Position Description:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="description"
                        placeholder="Describe what this position will be doing at the company."
                        v-model="formData.positionDescription"
                        maxlength="1500"
                        rows="4"
                        :class="{
                            'border-red-400 border-2': v$.positionDescription.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.positionDescription.$error" class="text-sm mt-1 text-red-400 block">{{ v$.positionDescription.$errors[0].$message }}</small>
                </label>
                <label class="block mt-8" for="requirements">
                    Position Requirements:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="requirements"
                        placeholder="What are the requirements for this position?"
                        v-model="formData.positionRequirements"
                        maxlength="2500"
                        rows="6"
                        :class="{
                            'border-red-400 border-2': v$.positionRequirements.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.positionRequirements.$error" class="text-sm mt-1 text-red-400 block">{{ v$.positionRequirements.$errors[0].$message }}</small>
                </label>
            </div>
            <div class="bg-dark p-8 py-16 md:max-w-4xl md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-16 shadow-2xl mb-16" >
                <h2 class="text-2xl text-center mb-2">Tailored Personal Details</h2>
                <p class="text-lg">It's often a good idea to tailor your resume to each position you apply for. This isn't required, but tailoring the information here can help the AI focus on the more important details relevant for this position.</p>
                <label class="block mb-8 mt-8" for="objective">
                    Objective:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="objective"
                        placeholder="What's your professional objective?"
                        v-model="formData.objective"
                        maxlength="500"
                        rows="2"
                        :class="{
                            'border-red-400 border-2': v$.objective.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.objective.$error" class="text-sm mt-1 text-red-400 block">{{ v$.objective.$errors[0].$message }}</small>
                </label>
                <label class="block mb-8 mt-8" for="education">
                    Education:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="education"
                        placeholder="Describe your education."
                        v-model="formData.education"
                        maxlength="1000"
                        rows="3"
                        :class="{
                            'border-red-400 border-2': v$.education.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.education.$error" class="text-sm mt-1 text-red-400 block">{{ v$.education.$errors[0].$message }}</small>
                </label>
                <label class="block mb-8 mt-8" for="experience">
                    Experience:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="experience"
                        placeholder="What relevant experience do you have?"
                        v-model="formData.experience"
                        maxlength="3000"
                        rows="6"
                        :class="{
                            'border-red-400 border-2': v$.experience.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.experience.$error" class="text-sm mt-1 text-red-400 block">{{ v$.experience.$errors[0].$message }}</small>
                </label>
                <label class="block mt-8" for="skills">
                    Skills:
                    <textarea
                        class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                        name="skills"
                        placeholder="List your relevant skills."
                        v-model="formData.skills"
                        maxlength="1000"
                        rows="5"
                        :class="{
                            'border-red-400 border-2': v$.skills.$error,
                        }"
                    ></textarea>
                    <small v-if="v$.skills.$error" class="text-sm mt-1 text-red-400 block">{{ v$.skills.$errors[0].$message }}</small>
                </label>
            </div>
            <ButtonPrimary type="submit" class="mx-auto block mt-16" :disabled="isLoading">Let's Prep!</ButtonPrimary>
            <small v-if="v$.$error" class="text-sm mt-1 text-red-400 block text-center">Correct the errors above and try again</small>
            <small v-if="supabaseError" class="text-sm mt-1 text-red-400 block text-center">Network error: {{ supabaseError }}. <br/>Please try again or refresh.</small>
          </form>
    </div>
</template>