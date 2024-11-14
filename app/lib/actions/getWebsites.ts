import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getWebsites(userid : string) {
    //user id is sent from the dashboard page 
    try {
        const presentWebsites = await prisma.website.findMany({
            where : {
                userid : userid
            }
        });
        return presentWebsites;
    } catch(err) {
        console.error("an error occured while fetching data" , err);
    }
}