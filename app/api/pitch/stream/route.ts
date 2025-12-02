import { NextRequest, NextResponse } from "next/server";
import {createOpenRouter} from "@openrouter/ai-sdk-provider";
import {generateObject} from "ai";
import {z} from "zod";
import {createClient} from "@deepgram/sdk";

export const runtime = 'edge';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});

const evaluationFunction = async ({systemPrompt, facials:{eyeContact, smileIntensity}, transcription}: {
  systemPrompt: string,
  facials: {
    eyeContact: number,
    smileIntensity: number
  },
  transcription: string
}) => {

  const {object} = await generateObject({
    model: openRouter("x-ai/grok-4.1-fast:free"),
    schema: z.object({
      feedback: z.object({
        score: z.number(),
        text: z.string().max(60),
        suggestion: z.string().max(100)
      })
    }),
    schemaDescription: "Feedback for the small part of the pitch",
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Transcript: ${transcription},
                  Eye Contact: ${eyeContact},
                  smileIntensity: ${smileIntensity},
                  Give a live feedback 
        `,

        }
    ]
  });
  console.log(object)
  return object
}

 


export async function POST(req:NextRequest){
  const {systemPrompt, pitchId, audio, facial: {eyeContactPct, smileIntensity}} = await req.json();

  if(!pitchId){
    return NextResponse.json({error: "pitchId required"}, {status: 400});

  }

  const audioBuffer = Buffer.from(audio);

  const {result, error} = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
      model: "nova-3",
      smart_format: true,
      diarize: true,
      language: "en-US",
      punctuate: true,
      utterances: true,
      
    }
  );

  if(error) throw error;
 

  if(!error){
    const transcript = result.results.channels[0].alternatives[0].transcript;
    const aiResponse = await evaluationFunction({systemPrompt: systemPrompt, facials: {
      eyeContact: eyeContactPct,
      smileIntensity: smileIntensity
    }, transcription: transcript});

    console.log(aiResponse);

    
  }




}