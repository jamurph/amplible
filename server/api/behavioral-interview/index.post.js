import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"


export default defineEventHandler(async (event) => {

    //get supabaseUser

    //best for this to create the db record to track progress. Then, the get can process it and handle if things go wrong. 
        //- because the preparations table is the basis for the specific preparations info. 
        //- We don't couple this with the more fragile stuff of initialization, as I think it will be easier to make the system resilient in these two parts.
        //- OpenAI API has failed a lot recently. We'll give the user a quick response after making the preparations table, then we'll lazy init when they hit the get request
        //- Plus, that page can have a loader + explainer of what is going on with the AI.
    const user = await serverSupabaseUser(event)
    const supabase = await serverSupabaseClient(event)

    const body = await readBody(event)

    
    //create new prep item. 
    const response = await supabase.from('preparations').insert({
        position_id: body.position,
        preparation_type_id: 'e8bf986e-b562-44a2-865e-08682586d762',
        user_id: user.id,
        page_route: `/prep/behavioral-interview/instance/{id}`
    }).select('*')

    if(response.error){
        throw new Error('Error creating new Behavioral Interview Instance. Please refresh the page and try again.')
    } 

    return {
        created_instance_id: response.data[0].id
    }
})
