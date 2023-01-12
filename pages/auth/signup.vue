<script setup>
    import { required, email, minLength, helpers, sameAs } from '@vuelidate/validators'
    import useVuelidate from '@vuelidate/core'

    const router = useRouter()

    const supabase = useSupabaseAuthClient()
    const creationError = ref('')
    const isLoading = ref(false)
    

    definePageMeta({
        middleware: 'unauthenticated'
    })


    const formData = reactive({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const rules = computed(() => {
        return {
            email : {
                required : helpers.withMessage('An email is required.', required), 
                email : helpers.withMessage('Invalid email format.', email)
            },
            password: {
                required : helpers.withMessage('A password is required.', required), 
                minLength: helpers.withMessage('Passwords must be 8 or more characters.',minLength(8))
            },
            confirmPassword: {
                required: helpers.withMessage('Please confirm your password.', required), 
                sameAs : helpers.withMessage('These passwords do not match.', sameAs(formData.password))
            }
        }
    })

    const v$ = useVuelidate(rules, formData)

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function signIn(){
        isLoading.value = true;

        v$.value.$validate();
        if(!v$.value.$error){
            //while we validated the confirmed password, that's just frontend sugar. We're good. :)
            try {
                const {error} = await supabase.auth.signUp({email: formData.email, password: formData.password});
                if(error){
                    creationError.value = error;
                } else {
                    //logged in!
                    navigateTo('/auth/confirm')
                }
            } catch (er) {
                creationError.value = "Something went wrong connecting to the server. Please refresh and try again.";
            }
        }

        isLoading.value = false;
    }
</script>

<template>
    
    <div class="bg-dark p-8 py-16 md:max-w-lg md:mx-auto mx-3 rounded-3xl border border-light-dark20 mt-20 shadow-2xl mb-32" >
      <h2 class="text-3xl text-center mb-2">Let's Get Started!</h2>
      <form @submit.prevent="signIn">
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
        <label class="block mb-8" for="password">
          Password:
          <input
            placeholder="Enter your password"
            class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
            type="password"
            id="password"
            v-model="formData.password"
            :class="{
                'border-red-400 border-2': v$.password.$error,
            }"
          />
          <small v-if="v$.password.$error" class="text-sm mt-2 text-red-400">{{ v$.password.$errors[0].$message }}</small>
        </label>
        <label class="block mb-8" for="confirmPassword">
          Confirm Password:
          <input
            placeholder="Confirm your password"
            class="rounded mt-1 p-2 w-full text-dark bg-light border-2"
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :class="{
                'border-red-400 border-2': v$.confirmPassword.$error,
            }"
          />
          <small v-if="v$.confirmPassword.$error" class="text-sm mt-2 text-red-400">{{ v$.confirmPassword.$errors[0].$message }}</small>
        </label>
        
        <ButtonPrimary class="mx-auto block mt-16"
        type="submit" :disabled="isLoading"
        >
        {{ isLoading ? 'Loading...' : 'Create Account'}}
    </ButtonPrimary>
    <small v-if="creationError" class="text-sm mt-2 text-red-400">{{ creationError }}</small>
        <p class="text-center mt-8">
            Already Have An Account?
            <NuxtLink to="/auth/signin" class="inline-block text-primary-dark20 hover:text-primary transition-all duration-300"> Sign In <Icon name="fa6-solid:arrow-right"></Icon></NuxtLink>
        </p>
      </form>
    </div>
  </template>