import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {title, description, goal, pitchTypeId} = await req.json();
    const session = await auth.api.getSession({
        headers: req.headers
    });
    const userId = session?.user.id;
    if(!session || !userId){
        return NextResponse.json({Message: "Unauthorized request"}, {status: 401});
    }


    if (!title?.trim() || !pitchTypeId?.trim()) {
        return NextResponse.json(
            { message: "Title and pitch type are required" },
            { status: 400 }
        );
    }


    const id = await prisma.pitch.create({
        data: {
            title: title,
            pitchTypeId: pitchTypeId,
            description: description,
            userId: userId,
            
        },
        select: {
            id: true
        }
    })
    console.log(id)

    return NextResponse.json(id);

    
}