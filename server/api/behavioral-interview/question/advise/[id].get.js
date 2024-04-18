import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server"

import  OpenAI  from 'openai'
import { sendStream } from 'h3'
import {Readable} from 'stream'

function buildAdvicePrompt(position,question){
    
    let prompt = `You are an AI that helps humans land their dream jobs. Give insightful, practical advice to a job seeker to help them understand how to answer the behavioral interview question. Begin by reasoning about what, specifically, an interviewer is looking for in an answer as well as what would make a great answer stand out from the rest. Then, detail ways the applicant could answer the question, incorporating the most applicable information from their objective, education, experience, and skills (below), if that would be helpful. Lastly, detail what the applicant should do if they are having trouble coming up with a good answer to this question or, if applicable, what to do when they don't have a direct answer. Be encouraging, insightful, and professional to the applicant in your advice.\n\n`
    
    //not including some info here, to keep the advice focused on the position title and applicant details.
    
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
    
    prompt +=`POSITION TITLE: """\n${position.title}\n"""\n\n`
    prompt += `QUESTION: """\n${question}\n"""\n\n`

    //finish out the prompt format

    prompt += `QUESTION ADVICE:\n`

    return prompt;
}

/* TODO: need to move this to helper */
function toNodeStream(openAIStream) {
    const nodeStream = new Readable({
      read() {}
    });
  
    // We are assuming here that the iterator will yield objects that include the structured data.
    // You may need to adapt this based on the exact shape of the data you log from the OpenAI stream.
    async function writeToStream() {
      for await (const chunk of openAIStream) {
        // Here we adapt based on the example you provided.
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          nodeStream.push(content); // Only push if content is defined
        }
      }
      nodeStream.push(null); // No more data
    }
  
    writeToStream().catch(err => {
      nodeStream.emit('error', err);
      nodeStream.push(null); // Ensure we close the stream on error
    });
  
    return nodeStream;
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
    const openAI = new OpenAI({
        apiKey: openAIsecret
    })

    const res = await openAI.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{role: "user", content: advicePrompt}],
        temperature: 0.4,
        max_tokens: 1250,
        top_p: 1,
        frequency_penalty: 0.05,
        presence_penalty: 0,
        user: user.id,
        stream: true
    },{ responseType: 'stream' });


     
    //experimental.
    const nodeCompatibleStream = toNodeStream(res);

    return sendStream(event, nodeCompatibleStream)
    

        


    
    /*
    TODO: move to a post the client calls.

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
    */
})