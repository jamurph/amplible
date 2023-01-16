import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"


export default defineEventHandler(async (event) => {

    //get supabaseUser

    //best for this to create the db record to track progress. Then, the get can process it and handle if things go wrong. 
    //Best not to group initial creation with call OpenAI stuff, since their API has been having a lot of failures.
    const user = await serverSupabaseUser(event)
    const supabase = await serverSupabaseClient(event)

    const body = await readBody(event)
    console.log(event);
    console.log(body.position);
    
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
