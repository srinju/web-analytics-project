import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req : Request ){
    
    const session  = await getServerSession(authOptions);
    if(!session) {
        return NextResponse.json({
            message : "unauthorized!"
        },{
            status : 401
        });
    }
    const {website} = await req.json();
    try {
        const newWebsite  = await prisma.website.create({
            data : {
                website_name : website.trim(),
                userid : session.user.id
            }
        });
        return NextResponse.json({
            newWebsite
        },{
            status : 200
        });
    } catch(err : any){
        return NextResponse.json({
            message : "faliled to add website",
            error : err.message
        },{
            status : 500
        });
    }
}