<script setup>
    import { required, email, minLength, helpers } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';

    definePageMeta({
        middleware: 'unauthenticated'
    })

    const supabase = useSupabaseAuthClient()
    const errorWithSupa = ref('')
    const isLoading = ref(false)

    const submitted = ref(false)

    const formData = reactive({
        email: '',
    })

    const rules = computed(() => {
        return {
            email : {
                required : helpers.withMessage('An email is required.', required), 
                email : helpers.withMessage('Invalid email format.', email)
            },
        }
    })

    const v$ = useVuelidate(rules, formData)

    async function submitForm(){
        isLoading.value = true;

        v$.value.$validate();
        if(!v$.value.$error){
            try {
                const {error} = await supabase.auth.resetPasswordForEmail(formData.email)
                if(error){
                    errorWithSupa.value = error
                } else {
                    submitted.value = true
                }
            } catch (er) {
                errorWithSupa.value = "Something went wrong connecting to the server. Please refresh and try again."
            }
        }

        isLoading.value = false;
    }


</script>

<template>
    <div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
        <h2 class="text-3xl text-center mb-2">Forgot Your Password?</h2>
        <p class="text-sm text-center">It happens. Let's get this worked out.</p>
        <form v-if="!submitted" @submit.prevent="submitForm">
            <label class="block mb-8 mt-8" for="email">
            Email:
            <input
                class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                type="email"
                id="email"
                placeholder="Enter your email"
                v-model="formData.email"
                :class="{
                    'border-red-400 border-2': v$.email.$error,
                }"
            />
            <small v-if="v$.email.$error" class="text-sm mt-2 text-red-400">{{ v$.email.$errors[0].$message }}</small>
            </label>
            <ButtonPrimary class="mx-auto block mt-16" :disabled="isLoading" type="submit">
                {{ isLoading ? 'Loading...' : 'Submit'}}
            </ButtonPrimary>
            <small v-if="errorWithSupa" class="text-sm mt-2 text-center text-red-400 block">{{ errorWithSupa }}</small>
        </form>
        <p class="text-lg text-emerald-400 mt-3 text-center" v-if="submitted">A Password Recovery Email has been sent. Please allow a few minutes for it to reach your inbox.<br><small class="text-sm text-light">If you do not see the email after several minutes, check your Spam folder.</small></p>
    </div>
</template>