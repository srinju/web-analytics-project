

//the user will send custom events request to our api endpoint with their own unique api key
//the request will be like name , domain , description
//we take the name , domain and the description from the body of the payload
//get the api key from the auth header 
//check the api key is present in the database or not 
//if the api key is there then fetch then create/insert entries of events in the database 

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req : Request){
    //handle cors policy
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*"); 
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    try {
        const authheader = req.headers.get("authorization");
        const {name , domain , description} = await req.json();
        if(authheader && authheader.startsWith("Bearer ")) {
            const apikey = authheader.split("Bearer ")[1];
            const USEr = await prisma.user.findUnique({
                where:{
                    apikey : apikey,
                }
            });
            if(USEr){
                if(name.trim() === "" || domain.trim() === ""){
                    return NextResponse.json({
                        error : "name and domain fields must not be empty!!"
                    },{
                        status : 400,
                        headers : headers
                    });
                } else {
                    const Event = await prisma.events.create({
                        data : {
                            event_name : name.toLowerCase(),
                            website_id : domain,
                            message : description
                        }
                    });
                    return NextResponse.json({
                        message : "events created successfully!!",
                        Event
                    },{
                        status : 200,
                        headers : headers
                    })
                }
            } else {
                return NextResponse.json({
                    error : "unauthorized"
                },{
                    status : 401,
                    headers : headers
                });
            }
        }
    } catch (error) {
        console.error("error occured ", error);
        return NextResponse.json({
            message : "Internal Server Error"
        },{
            status : 500,
            headers : headers
        });
    }
}

export async function OPTIONS(req: Request) {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return NextResponse.json(null, { headers });
}