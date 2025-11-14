import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {title, description, goal, pitchTypeId} = await req.json();

    if(!title && pitchTypeId){
        return NextResponse.json({message: "title and pitch type is required"}, {status: 402})
    }
    
}