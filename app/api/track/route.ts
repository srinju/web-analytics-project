

//handles the requests from the tracking script and store all the tracking data to the database 

import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//get the payloasd
//the url should match the data domain of the website the user wants to monitor ->  so add a check for that
//if event is session start then add the record to the visits table
//if the event is pageview then add the record to the page view table

//cors error fix>

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }

const prisma  = new PrismaClient();

export async function POST(req : Request) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return NextResponse.json({
            messgae : "unauthorised"
        }, {
            status : 401
        })
    }
    const res = await req.json(); //get the payload
    const { domain , url , event , source} = res;
    try {
        if(!url.includes(domain)) { //check thath the data domain matches with the data domain the user wants to monitor the website for
            return NextResponse.json({
                error : "the script points to a different domain than the current url.make , sure they match?"
            },{
                status : 401,
                headers : corsHeaders
            });
        }
        if(event == "session_start") { //create entry in visits for session start for user
            await prisma.visits.create({
                data : {
                    website_id : domain,
                    source : source ?? "Direct"
                    //userid : session.user.id
                }
            });
        }
        if(event == "pageview") { //create entry in page view for any other page view for users
            await prisma.page_view.create({
                data : {
                    domain : domain,
                    page : url,
                    //userid : session.user.id
                }
            });
        }
        return NextResponse.json({
            message : "entries successfully created!!",
            res
        },{
            status : 200,
            headers : corsHeaders
        })
    } catch (error) {
        console.error("error occured ",error);
        return NextResponse.json({
            message : "an error occured occured while inserting tracking data in the database"
        }, {
            status : 500,
            headers : corsHeaders
        })
    }
}