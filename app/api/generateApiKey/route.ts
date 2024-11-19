import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//route to generate the new api key and store it into the database

const prisma = new PrismaClient();

function generateApiKey() : string { //function to generate api key
    return randomBytes(32).toString("hex");
}

export async function POST(req :Request) {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            message : "unauthorized"
        },{
            status : 401
        });
    }
    try {
        const newApiKey = generateApiKey();
        const updatedUser = await prisma.user.update({
            where : {
                id : session.user.id
            },
            data : {
                apikey : newApiKey
            },
            select : {
                apikey : true
            }
        });
        return NextResponse.json({
            message : "api key generated successfully!!",
            apikey : updatedUser.apikey
        },{
            status : 200
        });
    } catch (error:any) {
        console.error("an error occured while generating the api key " , error.message);
        return NextResponse.json({
            error : "internal server error"
        },{
            status : 500
        });
    }
}