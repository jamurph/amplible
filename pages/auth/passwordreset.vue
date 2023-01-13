<script setup>
    import { required, email, minLength, helpers } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';

    


    const supabase = useSupabaseAuthClient()
    const errorWithSupa = ref('')
    const isLoading = ref(false)

    const successful = ref(false)



    const formData = reactive({
        password: '',
    })

    const rules = computed(() => {
        return {
            password : {
                required : helpers.withMessage('A password is required.', required), 
                minLength: helpers.withMessage('Passwords must be 8 or more characters.',minLength(8))
            },
        }
    })

    const v$ = useVuelidate(rules, formData)

    async function passwordreset(){
        isLoading.value = true;

        v$.value.$validate();
        if(!v$.value.$error){
            try {
                const {error} = await supabase.auth.updateUser({password: formData.password})
                if(error){
                    errorWithSupa.value = error;
                } else {
                    successful.value = true
                }
            } catch (er) {
                errorWithSupa.value = "Something went wrong connecting to the server. Please refresh and try again.";
            }
        }

        isLoading.value = false;
    }


</script>

<template>
    <div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
        <form v-if="!successful" @submit.prevent="passwordreset">
            <h2 class="text-3xl text-center mb-2">Reset Password</h2>
            <label class="block mb-8 mt-8" for="password">
            New Password:
            <input
                placeholder="Enter a shiny new password"
                class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
                type="password"
                id="password"
                v-model="formData.password"
                :class="{
                    'border-red-400 border-2': v$.password.$error,
                }"
            />
            <small v-if="v$.password.$error" class="text-sm mt-1 text-red-400 block">{{ v$.password.$errors[0].$message }}</small>
            </label>
            <ButtonPrimary class="mx-auto block mt-16" :disabled="isLoading"
            type="submit"
            >
            {{ isLoading ? 'Loading...' : 'Submit'}}
            </ButtonPrimary>
            <small v-if="errorWithSupa" class="text-sm mt-2 text-center text-red-400 block">{{ errorWithSupa }}</small>
        </form>
        <div v-if="successful">
            <p class="text-lg text-emerald-400 mt-3 text-center">Your password has been reset!</p>
            <NuxtLink to="/dashboard" class="block mt-4 text-primary-dark20 hover:text-primary transition-all duration-300 text-center"> Go to Dashboard <Icon name="fa6-solid:arrow-right"></Icon></NuxtLink>
        </div>
    </div>
</template>