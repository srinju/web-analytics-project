import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma =  new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            message : "you are not authenticated!"
        }, {
            status : 401
        })
    }
    try {
        const presentWebsites = await prisma.website.findMany({
            where : {
                userid : session.user.id
            }
        })
    
        return NextResponse.json({
            presentWebsites : presentWebsites,
            message : "websites fetched successfully!!"
        },{
            status : 200
        });
    } catch (error) {
        console.error("error occured ",error);
        return NextResponse.json({
            message : "error occured while fetching the websites"
        }, {
            status : 500
        });
    }
}