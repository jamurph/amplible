import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server"

import { Configuration, OpenAIApi } from 'openai'

function buildCritiquePrompt(position,question,answer){
    
    let prompt = `You are an AI that helps humans land their dream jobs. Give insightful, practical feedback to the job applicant about their answer to the behavioral interview question, below. Start by describing to the applicant how the interviewer might feel about the answer. Then, walk through the answer step by step and highlight which aspects are good and which need work. Give highly detailed and specific feedback on the relevance, specificity, clarity, and professionalism of the answer. Lastly, provide advice for how the answer could be improved, incorporating the best information from their objective, education, experience, and skills if that would be helpful. Be professional, encouraging, and insightful to the applicant. Refrain from talking about yourself.\n\n`
    //add position info to prompt: title, description, optionally requirements
    
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
    
    prompt+=`POSITION TITLE: """\n${position.title}\n"""\n\n`
    prompt += `QUESTION: """\n${question}\n"""\n\n`
    prompt += `ANSWER: """\n${answer}\n"""\n\n`
    //finish out the prompt format

    prompt += `ANSWER FEEDBACK:\n`

    return prompt;
}

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    
    const questionId = event.context.params.id;
    const answer = body.answer;
    const order = body.order;

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

    const critiquePrompt = buildCritiquePrompt(position, questionText, answer)

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
            prompt: critiquePrompt,
            temperature: 0,
            max_tokens: 1250,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            user: user.id
        });

    } catch (error) {
        throw new Error("AI Error. Servers may be overloaded. Please wait a moment and refresh.")
    }

    //trim result, set on local var, save answer to DB
    let completion = completionResponse.data.choices[0].text
    completion = completion.trim()

    //insert new answer and new critique record.
    const answerResponse = await privilegedSupabase.from('behavioral_interview_question_answer')
    .insert({
        question_id: questionId,
        text: answer,
        order: order,
    }).select('*')

    if(answerResponse.error){
        throw new Error('Connection Error with Database.')
    }

    const answer_id = answerResponse.data[0].id

    const critiqueResponse = await privilegedSupabase.from('behavioral_interview_question_answer_critique')
    .insert({
        answer_id: answer_id,
        prompt: critiquePrompt,
        text: completion,
    }).select('*')

    if(critiqueResponse.error){
        throw new Error("Connection Error with Database.")
    }
    

    //TODO charge tokens. :)

    return {
        id: answer_id,
        text: completion
    }
})