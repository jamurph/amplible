import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server"

import { Configuration, OpenAIApi } from 'openai'

function buildAdvicePrompt(position,question){
    
    let prompt = `I am an expert recruiter being paid a lot of money to prepare candidates for interviews. Give advice to the job seeker to help them understand how to answer the QUESTION. Begin by reasoning about what the interviewer would like in an answer to the QUESTION. Then, provide highly-detailed, practical ways the QUESTION could be answered. Provide specific advice and suggestions based on the company, position, and resume, when appropriate. If the applicant could be unfamiliar with what is asked or might not otherwise be able to answer the question, explain how they could respond truthfully and make the most of the opportunity in the interview. Be encouraging, insightful, and professional. Write as if you are talking directly to the applicant.\n\n`
    //add position info to prompt: title, description, optionally requirements
    prompt+=`POSITION TITLE: """\n${position.title}\n"""\n\nPOSITION DESCRIPTION: """\n${position.description}\n"""\n\n`

    if(position.requirements){
        prompt += `POSITION REQUIREMENTS: """\n${position.requirements}\n"""\n\n`
    }

    //add optional personal details: objective, education, experience, skills
    if(position.objective){
        prompt += `APPLICANT OBJECTIVE: """\n${position.objective}\n"""\n\n`
    }

    if(position.education){
        prompt += `APPLICANT EDUCATION: """\n${position.education}\n"""\n\n`
    }

    if(position.experience){
        prompt += `APPLICANT EXPERIENCE: """\n${position.experience}\n"""\n\n`
    }

    if(position.skills){
        prompt += `APPLICANT SKILLS: """\n${position.skills}\n"""\n\n`
    }

    prompt += `QUESTION: """\n${question}\n"""\n\n`

    //finish out the prompt format

    prompt += `QUESTION ADVICE:\n`

    return prompt;
}

export default defineEventHandler(async (event) => {

    
    const questionId = event.context.params.id;
    
    const user = await serverSupabaseUser(event)
    const privilegedSupabase = await serverSupabaseServiceRole(event)

    //get the question and position info
    const getQuestion = await privilegedSupabase.from('behavioral_interview_question')
        .select('*, behavioral_interview_prep(preparations(positions(*)))')
        .eq('id', questionId)
        .eq('behavioral_interview_prep.user_id', user.id)

    if(getQuestion.error || !getQuestion.data || getQuestion.data.length == 0){
        throw new Error(getQuestion.error.message)
    } 

    const position = getQuestion.data[0].behavioral_interview_prep.preparations.positions;
    const questionText = getQuestion.data[0].text;

    const advicePrompt = buildAdvicePrompt(position, questionText)

    //init OpenAI
    const runtimeConfig = useRuntimeConfig()
    const openAIsecret = runtimeConfig.openAISecret
    const configuration = new Configuration({
        apiKey: openAIsecret
    })
    const openAI = new OpenAIApi(configuration)

    let completionResponse = null
    try {
        completionResponse = await openAI.createCompletion({
            model: "text-davinci-003",
            prompt: advicePrompt,
            temperature: 0.4,
            max_tokens: 1250,
            top_p: 1,
            frequency_penalty: 0.05,
            presence_penalty: 0,
            user: user.id
        });

    } catch (error) {
        throw new Error("AI Error. Servers may be overloaded. Please wait a moment and refresh.")
    }

    //trim result, set on local var, save advice to DB
    let completion = completionResponse.data.choices[0].text
    completion = completion.trim()
    
    const insertAdvice = await privilegedSupabase.from('behavioral_interview_question_advice').insert({
        question_id: questionId,
        prompt: advicePrompt,
        text: completion
    })

    if(insertAdvice.error){
        throw new Error("Error handling AI response. Please wait a moment and refresh.")
    }

    //TODO charge tokens. :)

    return {
        text: completion
    }
})