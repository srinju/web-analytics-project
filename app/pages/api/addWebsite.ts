import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(req : NextApiRequest , res : NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).json({
            message : "method not allowed!!"
        });
    }
    const session  = await getServerSession(authOptions);
    if(!session) {
        return res.status(401).json({
            message : "unauthorized!"
        });
    }
    const {website} = req.body;
    try {
        const newWebsite  = await prisma.website.create({
            data : {
                website_name : website,
                userid : session.user.id
            }
        });
        res.status(200).json({
            newWebsite
        });
    } catch(err : any){
        res.status(500).json({
            message : "faliled to add website",
            error : err.message
        })
    }
}