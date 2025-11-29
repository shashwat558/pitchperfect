import { NextRequest, NextResponse } from "next/server";
import {createOpenRouter} from "@openrouter/ai-sdk-provider";
import {streamText} from "ai";
import {z} from "zod";
import {createClient} from "@deepgram/sdk";

export const runtime = 'edge';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});

 


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
      smart_format: true
    }
  );

  if(error) throw error;

  if(!error) console.dir(result, {depth: null})




}