import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma  = new PrismaClient();

export interface RouteSegmentConfig {
    params : {
        website : string
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export  async function GET(req : NextRequest , { params } : any ) {

    //handle cors policy
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*"); 
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    const {website} = await params;
    console.log("api called for website ", website);
    if(!website) {
        return NextResponse.json({
            message : "website not provided"
        }, {
            status : 400,
            headers : headers
        });
    }
    
    try {
        console.log('fethcing analytics data for website : ', website);

        const websiteData = await prisma.website.findFirst({
            where : {
                website_name : website
            }
        });

        if(!websiteData){
            return NextResponse.json({
                error : "website not found!!"
            }, {
                status : 404,
                headers : headers
            });
        }

        const views = await prisma.page_view.findMany({
            where : {
                domain : website
            }
        });

        const visits = await prisma.visits.findMany({
            where : {
                website_id : website
            }
        });

        const events = await prisma.events.findMany({
            where :{
                website_id : website
            }
        });
        return NextResponse.json({
            message : "analytics fetched successfully!",
            views,
            visits,
            events,
            websiteData
        },{
            status : 200,
            headers : headers
        });
    } catch (error) {
        console.error("an error occured while fetching analytics ", error);
        return NextResponse.json({
            error : "Internal server error"
        },{
            status : 500,
            headers : headers
        })
    }
}

export async function OPTIONS(req: Request) {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return NextResponse.json(null, { headers });
}