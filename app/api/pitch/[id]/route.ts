import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>}){
    const {id} = await params;
    if(!id){
        return NextResponse.json({message: "PitchId required"}, {status: 400});

    }
    
    const pitch = await prisma.pitch.findUnique({
        where: {
            id: id
        },
        select: {
            title: true,
            description: true,
            pitch_type: {
                select: {
                    name: true,
                    duration: true,
                    system_prompt: true,
                    template_script: true
                }
            }
        }
    });
    console.log(pitch)
    return NextResponse.json({pitch})

}