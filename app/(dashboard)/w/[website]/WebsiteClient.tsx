"use client"

import AppBar from "@/app/components/AppBar";
import { getWebsites } from "@/app/lib/actions/getWebsites";
import { PrismaClient } from "@prisma/client";
import { redirect, useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface WebsiteClientProps {
    website : string,
    //websites : any,
    session : {
        name : string,
        email : string,
        password : string,
        id : string
    }
}

interface PageView {
    id: string;
    userid: string;
    created_at: Date;
    domain: string;
    page: string;
}

interface Visit {
    id: string;
    userid: string;
    created_at: Date;
    website_id: string;
    source: string | null;
}

interface GroupedPageView {
    page: string;
    visits: number; 
}

const prisma = new PrismaClient();

export default function WebsiteClient({website  , session} : WebsiteClientProps) {
    //const params  = useParams();
    //website gets the current domain of the user for monitoring reads
    //websites is for all the website data(not really needed)
    //session is for the current user session 

    const [loading , setLoading] = useState(false);
    const [pageViews , setPageViews] = useState<PageView[]>([]);
    const [totalVisits , setTotalVisits] = useState<Visit[]>([]);
    const [groupedPageViews , setGroupedPageViews] = useState<GroupedPageView[]>([]);
    
    useEffect(() => {
        if(!session) {
            return redirect('/api/auth/signin');
        }    
        const checkWebsiteCurrentUser = async () => { //check website for the current website registered for the user or not 
            const websiteData = await prisma.website.findFirst({
                where : {
                    website_name  : website,
                    userid : session.id
                }
            });
            if(!websiteData) {
                redirect('/dashboard');
            } else {
                setTimeout(() => {
                    fetchViews();
                },500);
            }
        };
        checkWebsiteCurrentUser();   
    },[session]);

    const fetchViews  = async() => {
        setLoading(true);
        try {
            const [viewsResponse ,visitsResponse ] = await Promise.all([
                prisma.page_view.findMany({
                    where : {
                        domain : website,
                        userid : session.id
                    }
                }),
                prisma.visits.findMany({
                    where : {
                        website_id : website,
                        userid : session.id
                    }
                })
            ]);
            const views = viewsResponse;
            const visits = visitsResponse;
            setPageViews(views);
            setGroupedPageViews(groupPageViews(views));
            setTotalVisits(visits);
        } catch(error) {
            console.error("error occured while in fetchViews function" , error);
        } finally {
            setLoading(false);
        }
    }

    //This function groups URLs by page path and counts the number of visits per path, returning a simplified list of unique pages and their respective visit counts.

    function groupPageViews(pageViews : any) {
        const groupedPageViews : any = {};
        pageViews.forEach(({page} : any)  => {
            //extract the path from the page URL by removing the protocol and the hostname
            const path = page.replace(/^(?:\/\/|[^/]+)*\//,"");
            // increment the visit count for the page path
            groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
        });

        return Object.keys(groupedPageViews).map((page) => ({
            page : page,
            visits : groupedPageViews[page]
        }));
    }

    if(loading) {
        <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
            <AppBar name = {session.name}/>
            <div className="min-h-screen w-full items-center justify-center flex text-white relative">
                Loading ...
            </div>
        </div>
    }

    return(
        <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
            <AppBar name={session.name} />
            <div>
                <p>website : {website}</p>
                <p>name : {session.name}</p>
            </div>
            
        </div>
    )
}