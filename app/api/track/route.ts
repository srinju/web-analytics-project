

//handles the requests from the tracking script and store all the tracking data to the database 

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

//get the payloasd
//the url should match the data domain of the website the user wants to monitor ->  so add a check for that
//if event is session start then add the record to the visits table
//if the event is pageview then add the record to the page view table

const prisma  = new PrismaClient();

export async function POST(req : Request) {
    //handle cors policy
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*"); 
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    const res = await req.json(); //get the payload
    const { domain , url , event , source} = res;
    try {
        const urlDomain = new URL(url).hostname; //extracting the hostname from the url
        if(urlDomain !== domain){
            return NextResponse.json({
                error : "The script points to a different domain than the current url . Make sure they match."
            },{
                status : 401,
                headers : headers
            })
        }
        if(event == "session_start") { //create entry in visits for session start for user
            await prisma.visits.create({
                data : {
                    website_id : domain,
                    source : source ?? "Direct"
                }
            });
        }
        if(event == "pageview") { //create entry in page view for any other page view for users
            await prisma.page_view.create({
                data : {
                    domain : domain,
                    page : url,
                }
            });
        }
        return NextResponse.json({
            message : "entries successfully created!!",
            res
        },{
            status : 200,
            headers : headers
        })
    } catch (error) {
        console.error("error occured ",error);
        return NextResponse.json({
            message : "an error occured occured while inserting tracking data in the database"
        }, {
            status : 500,
            headers : headers
        })
    }
}

export async function OPTIONS() {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return NextResponse.json(null, { headers });
}