import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
    const pitchTypes = await prisma.pitchType.findMany({
        select: {
            id: true,
            name: true
        }
    })
    if(!pitchTypes){
        return NextResponse.json("Error getting pitchTypes", {status: 402});
    }

    return NextResponse.json({pitchTypes})
}