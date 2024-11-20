import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            message : "unauthorized"
        },{
            status : 401 
        });
    }

    try {
        const User = await prisma.user.findUnique({
            where : {
                id : session.user.id
            },
            select : {
                apikey : true
            }
        });

        if(!User) {
            return NextResponse.json({
                error : "User not found"
            }, {
                status : 404
            })
        }

        return NextResponse.json({
            apikey : User.apikey
        });
    } catch(error){
        console.error("an error occured while getting the api key for the user " , error);
        return NextResponse.json({
            message : "internal server error!"
        }, {
            status : 500
        });
    }
}