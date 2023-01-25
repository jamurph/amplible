import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server"

import { Configuration, OpenAIApi } from 'openai'


function buildQuestionPrompt(position){
    let prompt = `I am an expert recruiter being paid a lot of money to find the best candidates. Brainstorm 30 open-ended, high-quality questions to ask the job applicant below in a behavioral interview to evaluate if the job applicant is a good fit for this role. Refrain from asking redundant questions.\n\n`
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

    //finish out the prompt format

    prompt += `BRAINSTORMED QUESTIONS:\n1.`

    return prompt;
}


function buildQuestionImprovementPrompt(position, questions){
    let prompt = `I am an expert recruiter being paid a lot of money to find the best candidates. I have brainstormed some questions to ask the job applicant below in a behavioral interview to evaluate if they are a good fit for this role. Improve the questions by making sure the questions are specific, targeted, and open-ended. Reword leading questions. Remove any questions about sensitive topics that could be seen as discriminatory. Refrain from asking questions that are too similar.\n\n`
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

    prompt += `BRAINSTORMED QUESTIONS: """\n${questions}\n"""\n\n`

    //finish out prompt format
    prompt += `IMPROVED QUESTIONS:\n1.`

    return prompt;
}

function extractQuestionsFromString(questionString){
    const questionRegex = /^\d+\.\s+(.+)/gm;
    let match;
    const questionStrings = [];
    while ((match = questionRegex.exec(questionString)) !== null) {
        questionStrings.push(match[1]);
    }

    return questionStrings;
}


export default defineEventHandler(async (event) => {

    
    //todo CHECK FOR RIGHTS -> always verify is attached to current user.

    const prepId = event.context.params.id;

    const privilegedSupabase = await serverSupabaseServiceRole(event)
    const clientSupabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    let position = null
    let preparation = null
    let behavioral_interview_prep = null

    //we only ever access these tables via privileged role, as a means of protecting IP
    const getPreparation = await clientSupabase.from('preparations').select('*, positions(*)').eq('id', prepId)
    const getBehavioralPrepBase = await privilegedSupabase.from('behavioral_interview_prep').select('*').eq('preparation_id', prepId).eq('user_id', user.id)

    //check errors
    if(getPreparation.error || getBehavioralPrepBase.error){
        throw new Error('Could not retrieve prep.')
    }

    preparation = getPreparation.data[0]
    position = getPreparation.data[0].positions

    if(!getBehavioralPrepBase.data || getBehavioralPrepBase.data.length === 0){
        //init behavioralPrep record
        //if no user, will fail due to null
        //won't be insecure preparation.id (for diff user, e.g.) due to above query
        const baseInsert = await privilegedSupabase.from('behavioral_interview_prep').insert({
            preparation_id: preparation.id,
            user_id: user.id
        }).select('*')

        if(baseInsert.error){
            throw new Error('Initialization Error. Please try again.')
        }

        behavioral_interview_prep = baseInsert.data[0]
    } else {
        //set variable
        behavioral_interview_prep = getBehavioralPrepBase.data[0]
    }

    //now we have position, preparation, and behavioral_base. 


    //let us first query for an existing question/answer/critique/advice tree. 
    //If that comes up empty, we'll walk through each step of initialization to see if it has been performed. If not, we form prompt and call OpenAI

    const qaTreeResponse = await privilegedSupabase.from('behavioral_interview_question')
    .select('*, behavioral_interview_question_answer(*, behavioral_interview_question_answer_critique(*)), behavioral_interview_question_advice(*)')
    .eq('interview_id', behavioral_interview_prep.id) 
    .order('order', {ascending: true})
    
    if(qaTreeResponse.error){
        throw new Error("Could not retrieve QA information.")
    }

    //an array of questions, each with arrays for other things.
    const qaTree = qaTreeResponse.data

    if(!qaTree || qaTree.length === 0){
        //uninitialized. Let's do the steps needing done.

        const runtimeConfig = useRuntimeConfig()
        const openAIsecret = runtimeConfig.openAISecret
        const configuration = new Configuration({
            apiKey: openAIsecret
        })
        const openAI = new OpenAIApi(configuration)



        //initial_questions_output
        if(!behavioral_interview_prep.initial_questions_output){
            const prompt = buildQuestionPrompt(position)


            //openAI uses Axios instead of fetch, so handle slightly differently
            let completionResponse = null
            try {
               completionResponse = await openAI.createCompletion({
                    model: "text-davinci-003",
                    prompt: prompt,
                    temperature: 0.4,
                    max_tokens: 1250,
                    top_p: 1,
                    frequency_penalty: 0.05,
                    presence_penalty: 0,
                    user: user.id
                });

            } catch (error){
                throw new Error("AI Error. Servers may be overloaded. Please wait a moment and refresh.")
            }

            //trim result, append the prefix "1. ", set on local var, save progress to DB.
            let completion = completionResponse.data.choices[0].text
            completion = completion.trim()
            completion = '1. ' + completion
            
            behavioral_interview_prep.initial_questions_output = completion
            behavioral_interview_prep.initial_questions_prompt = prompt

            const updateBIP = await privilegedSupabase.from('behavioral_interview_prep').update({
                initial_questions_output: behavioral_interview_prep.initial_questions_output,
                initial_questions_prompt: behavioral_interview_prep.initial_questions_prompt
            }).eq('id', behavioral_interview_prep.id)

            if(updateBIP.error){
                throw new Error("Error handling AI response. Please wait a moment and refresh.")
            }

        }
    
        //improved_questions
        if(!behavioral_interview_prep.improved_questions_output){
            const prompt = buildQuestionImprovementPrompt(position, behavioral_interview_prep.initial_questions_output)


            //openAI uses Axios instead of fetch, so handle slightly differently
            let completionResponse = null
            try {
               completionResponse = await openAI.createCompletion({
                    model: "text-davinci-003",
                    prompt: prompt,
                    temperature: 0.4,
                    max_tokens: 1250,
                    top_p: 1,
                    frequency_penalty: 0.05,
                    presence_penalty: 0,
                    user: user.id
                });

            } catch (error){
                throw new Error("The AI encountered an error. Servers may be overloaded. Please wait a moment and refresh.")
            }

            //trim result, append the prefix "1. ", set on local var, save progress to DB.
            let completion = completionResponse.data.choices[0].text
            completion = completion.trim()
            completion = '1. ' + completion
            
            behavioral_interview_prep.improved_questions_output = completion
            behavioral_interview_prep.improved_questions_prompt = prompt

            const updateBIP = await privilegedSupabase.from('behavioral_interview_prep').update({
                improved_questions_output: behavioral_interview_prep.improved_questions_output,
                improved_questions_prompt: behavioral_interview_prep.improved_questions_prompt
            }).eq('id', behavioral_interview_prep.id)

            if(updateBIP.error){
                throw new Error("Error handling AI response. Please wait a moment and refresh.")
            }
        }

        //lets extract the questions.
        const questionArray = extractQuestionsFromString(behavioral_interview_prep.improved_questions_output)
        if(!questionArray || questionArray.length === 0){
            //an option here would be to clear the prep, as well, such that there's a possibility that a reload and reacquisition of OpenAI completion could produce valid results.
            throw new Error("AI Error while initializing. The AI Failed to produce a valid response. Please return to the position and try to create a new module. If this problem persists, please contact us.")
        }
        let questionInsertObjects = []
        for(let i = 0; i < questionArray.length; i++){
            questionInsertObjects.push({
                interview_id: behavioral_interview_prep.id,
                order: i,
                text: questionArray[i]
            })
        }

        //insert questions. Use same select as above to return the same exact object to send to client.
        const questionInsertResult = await privilegedSupabase.from('behavioral_interview_question')
        .insert(questionInsertObjects)
        .select('*, behavioral_interview_question_answer(*, behavioral_interview_question_answer_critique(*)), behavioral_interview_question_advice(*)')
        .order('order', {ascending: true})

        if(questionInsertResult.error){
            throw new Error("Error connecting to server. Please refresh and try again.")
        }


        const newTree = questionInsertResult.data
        return {qaTree: newTree}
    } else {
        return {qaTree: qaTree}
    }
    
})