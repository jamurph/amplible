import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server"


export default defineEventHandler(async (event) => {

    const questionId = event.context.params.id;
    
    const user = await serverSupabaseUser(event)
    const privelegedSupabase = await serverSupabaseServiceRole(event)

    const body = await readBody(event)

    //get question and behavioral prep, to check current user owns the question. It seems postgrest doesn't yet support this kind of check directly in an update
    const getQuestion = await privelegedSupabase.from('behavioral_interview_question')
        .select('*, behavioral_interview_prep(*)')
        .eq('id', questionId)
        .eq('behavioral_interview_prep.user_id', user.id)

    if(getQuestion.error || !getQuestion.data || getQuestion.data.length == 0){
        throw new Error('Could not retrieve question')
    } 

    //Update. All the user is allowed to update at this time is skipped
    const updateQuestion = await privelegedSupabase.from('behavioral_interview_question').update({
        skipped: body.skipped
    }).eq('id', questionId).select('*')

    if(updateQuestion.error){
        throw new Error(updateQuestion.error.message)
    } 


    return {response: updateQuestion}
})