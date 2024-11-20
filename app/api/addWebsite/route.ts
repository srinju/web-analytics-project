import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req : Request ){
    console.log("API api/addWebsite is called");
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
        const existingWebsite = await prisma.website.findFirst({
            where : {
                website_name : website.trim(),
                userid : session.user.id
            }
        });
        if(existingWebsite){
            console.log("Error : Website already exisits");
            return NextResponse.json({
                message : "this domain already exisits!!"
            }, {
                status : 409
            })
        }
        const newWebsite  = await prisma.website.create({
            data : {
                website_name : website.trim(),
                userid : session.user.id
            }
        });
        console.log("New website created ", newWebsite);
        return NextResponse.json({
            newWebsite,
            message : "website added successfully!!"
        },{
            status : 200
        });
    } catch(err){
        console.error("error occured ",err);
        return NextResponse.json({
            message : "faliled to add website",
        },{
            status : 500
        });
    }
}