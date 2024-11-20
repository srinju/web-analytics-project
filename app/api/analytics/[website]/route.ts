import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma  = new PrismaClient();

export interface RouteSegmentConfig {
    params : {
        website : string
    }
}

export  async function GET(req : NextRequest , { params } : any ) {
    
    const {website} = await params;
    console.log("api called for website ", website);
    if(!website) {
        return NextResponse.json({
            message : "website not provided"
        }, {
            status : 400
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
                status : 404
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
            status : 200
        });
    } catch (error) {
        console.error("an error occured while fetching analytics ", error);
        return NextResponse.json({
            error : "Internal server error"
        },{
            status : 500
        })
    }
}