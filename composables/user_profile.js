
export const useUserProfileStore = defineStore('user_profile', () => {
    const id = ref()
    const created_at = ref()
    const acknowledged_ai = ref()
    const is_onboarded = ref()
    const objective = ref()
    const education = ref()
    const experience = ref()
    const skills = ref()

    const initialized = ref(false)
    const updating = ref(false)

    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    //in-store init. Not a getter
    async function getUserProfile(){
        //must be called on client
        if(user.value){
            let response = await supabase.from('user_profiles').select('*').eq('id', user.value.id).limit(1)
            if(response.data.length == 0){
                //new user
                const {error} = await supabase.from('user_profiles').insert(
                    {
                        id: user.value.id
                    })
                if(error){
                    throw new Error('Could not retrieve user profile data. Please refresh and try again.')
                }
                
                //new user initial values
                acknowledged_ai.value = false
                is_onboarded.value = false
                id.value = user.value.id

            } else if(!response.error){
                id.value = response.data[0].id
                created_at.value = response.data[0].created_at
                acknowledged_ai.value = response.data[0].acknowledged_ai
                is_onboarded.value = response.data[0].is_onboarded
                objective.value = response.data[0].objective
                education.value = response.data[0].education
                experience.value = response.data[0].experience
                skills.value = response.data[0].skills
            } else {
                throw new Error('Could not get user profile data. Please refresh and try again.') 
            }
            
            initialized.value = true
        }


    
    }
    
    //init 
    onMounted(async () => {
        //get initial values (or create user and set initial values)
        await getUserProfile()
        //watch for changes to state, and update via API
        watch([acknowledged_ai,is_onboarded,objective,education,experience,skills], async () => {
            updating.value = true
            const {error} = await supabase.from('user_profiles').update(
                {
                    acknowledged_ai: acknowledged_ai.value,
                    is_onboarded: is_onboarded.value,
                    objective: objective.value,
                    education: education.value,
                    experience: experience.value,
                    skills: skills.value
                }).eq('id', id.value)
            if(error){
                throw new Error('Could not retrieve user profile data. Please refresh and try again.')
            }
            updating.value = false
        })
    });
    
    


    return {id, created_at, acknowledged_ai, is_onboarded, objective, education, experience, skills, initialized, updating}
})