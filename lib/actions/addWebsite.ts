import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";


const prisma  = new PrismaClient();


export async function addWebsite(website : string ) {
    const session = await getServerSession(authOptions);
    if(!session) return null;
    try{
        const newWebsite = await prisma.website.create({
            data : {
                website_name : website,
                userid : session.user.id || session.user.name
            }
        });
        return newWebsite;
    }catch(err){
        throw new Error('Failed to add website!!');
    }
}
