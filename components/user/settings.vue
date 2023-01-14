<script setup>
    import { maxLength, helpers } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import { storeToRefs } from 'pinia';

    const userProfile = useUserProfileStore()
    const {initialized, updating} = storeToRefs(userProfile)
    

    const formData = reactive({
        objective: '',
        education: '',
        experience: '',
        skills: '',
    })

    const rules = computed(() => {
        return {
            objective : {
                maxLength : helpers.withMessage('Sorry - this Objective breaks the maximum length requirement.', maxLength(100)) //500
            },
            education : {
                maxLength : helpers.withMessage('Sorry - this Objective breaks the maximum length requirement.', maxLength(100)) //1000
            },
            experience : {
                maxLength : helpers.withMessage('Sorry - this Objective breaks the maximum length requirement.', maxLength(100)) //3000
            },
            skills : {
                maxLength : helpers.withMessage('Sorry - this Objective breaks the maximum length requirement.', maxLength(100)) //1000
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
    
    const loadingOrUpdating = computed(() => {
        return isLoading.value || updating.value
    })

    const submitted = ref(false)
    const error = ref(false)

    const submittedSuccessfully = computed(()=>{
        return submitted.value && !updating.value && !error.value
    })

    async function submitForm(){
        submitted.value = false //reset to show message again...
        isLoading.value = true

        v$.value.$validate();
        if(!v$.value.$error){
            userProfile.objective = formData.objective
            userProfile.education = formData.education
            userProfile.experience = formData.experience
            userProfile.skills = formData.skills

            submitted.value = true
        }

        isLoading.value = false;
    }
</script>
<template>
    <div class="bg-dark p-8 py-16 md:max-w-4xl md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-16" >
      <h2 class="text-3xl text-center mb-2">Personal Defaults</h2>
      <LoadingSpinner v-if="!initialized" />
      <form v-else @submit.prevent="submitForm">
        <label class="block mb-8 mt-8" for="objective">
          Objective:
          <textarea
            class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
            name="objective"
            placeholder="What's your professional objective?"
            v-model="formData.objective"
            maxlength="100"
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
            name="objective"
            placeholder="Describe your education."
            v-model="formData.education"
            maxlength="100"
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
            maxlength="100"
            rows="6"
            :class="{
                'border-red-400 border-2': v$.experience.$error,
            }"
          ></textarea>
          <small v-if="v$.experience.$error" class="text-sm mt-1 text-red-400 block">{{ v$.experience.$errors[0].$message }}</small>
        </label>
        <label class="block mb-8 mt-8" for="skills">
          Skills:
          <textarea
            class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
            name="skills"
            placeholder="List your relevant skills."
            v-model="formData.skills"
            maxlength="100"
            rows="5"
            :class="{
                'border-red-400 border-2': v$.skills.$error,
            }"
          ></textarea>
          <small v-if="v$.skills.$error" class="text-sm mt-1 text-red-400 block">{{ v$.skills.$errors[0].$message }}</small>
        </label>
        <ButtonPrimary class="mx-auto block mt-16" :disabled="loadingOrUpdating"
          type="submit"
        >
          {{ loadingOrUpdating ? 'Loading...' : 'Save Defaults'}}
        </ButtonPrimary>
          <small v-if="submittedSuccessfully" class="text-sm mt-1 text-emerald-400 block text-center">Changes Saved!</small>
      </form>
    </div>
</template>