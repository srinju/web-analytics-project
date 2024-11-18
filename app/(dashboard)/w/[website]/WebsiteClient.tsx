"use client"

import AppBar from "@/app/components/AppBar";
import { getWebsites } from "@/app/lib/actions/getWebsites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrismaClient } from "@prisma/client";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WebsiteClientProps {
    //website : string,
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
    //userid: string;
    created_at: Date;
    domain: string;
    page: string;
}

interface Visit {
    id: string;
    //userid: string;
    created_at: Date;
    website_id: string;
    source: string | null;
}

interface GroupedPageView {
    page: string;
    visits: number; 
}


export default function WebsiteClient({session} : WebsiteClientProps) {
    //const params  = useParams();
    //website gets the current domain of the user for monitoring reads
    //websites is for all the website data(not really needed)
    //session is for the current user session 

    const [loading , setLoading] = useState(false);
    const [pageViews , setPageViews] = useState<PageView[]>([]);
    const [totalVisits , setTotalVisits] = useState<Visit[]>([]);
    const [groupedPageViews , setGroupedPageViews] = useState<GroupedPageView[]>([]);
    const router = useRouter();

    const params =  useParams();
    const website =  params.website as string;
    
    useEffect(() => {
        console.log("use effect mounted!!");
        if(!session) {
            return redirect('/api/auth/signin');
        }
        /*    
        const checkWebsiteCurrentUser = async () => { //check website for the current website registered for the user or not 
            console.log("checking if website belongs to current user ",website);
            
            const websiteData = await prisma.website.findFirst({
                where : {
                    website_name  : website,
                    userid : session.id
                }
            });
            console.log("the website data from the useeffect is ",websiteData);
            if(!websiteData) {
                redirect('/dashboard');
            } else {
                setTimeout(() => {
                    fetchViews();
                },500);
            }
        };
        checkWebsiteCurrentUser();
        */

        const fetchViews  = async() => {
            setLoading(true);
            console.log('website that is gonna show the analytics for ' , website);
            try {
                console.log("constructing api call to : ", `/api/analytics/${website}`);
    
                const response = await fetch(`/api/analytics/${website}` , {
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                });
                console.log("response status ", response.status);
                console.log('response from the analytics endpoint ' , response);
    
                if(!response.ok) {
                    console.error("erorr fetching analytics", response.statusText);
                    router.push('/dashboard');
                    throw new Error("Failed to fetch analytics data");
                }
                const data = await response.json();
                if(!data.websiteData) {
                    router.push('/dashboard');
                }
                setPageViews(data.views || []);
                setGroupedPageViews(groupPageViews(data.views || []));
                setTotalVisits(data.visits || []);
            } catch(error) {
                console.error("error occured while in fetchViews function" , error);
            } finally {
                setLoading(false);
            }
        }

        if(website){
            fetchViews();
        } else {
            console.error('website parameter is undefined , redirecting to dashboard');
            router.push('/dashboard');
        }

    },[session,website]);

    

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

    const abbreviateNumber = (number : number) => {
        if(number >= 1000000) {
            return (number / 1000000).toFixed(1) + "M";
        } else if(number >= 1000) {
            return (number / 1000).toFixed(1) + "K";
        } else {
            return number.toString();
        }
    }

    if(loading) {
        return <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
            <AppBar name = {session.name}/>
            <div className="min-h-screen w-full items-center justify-center flex text-white relative">
                Loading ...
            </div>
        </div>
    }

    return(
        <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
            <AppBar name={session.name} />
            {pageViews?.length == 0 && totalVisits.length ==0 && !loading ? <div className="w-full items-center justify-center
             flex flex-col space-y-6 z-40 relative min-h-screen px-4">
                <div className="z-40 w-full lg:w-2/3 bg-black border border-white/10 py-12 px-8 items-center justify-center flex flex-col text-white space-y-4 relative">
                    <p className="bg-green-900 rounded-full p-4 animate-pulse" />
                    <p>Waiting for the first Page View</p>
                    <button
                        onClick={() => {
                            window.location.reload();
                        }} 
                        type="button" 
                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Refresh</button>
                        <div>
                            {/* SCRIPT  PART */}
                        </div>
                </div>
             </div> : <div className="w-full justify-center flex items-center">
                <Tabs defaultValue="general" className="w-full items-center justify-center flex flex-col">
                    <TabsList className="w-full bg-transparent mb-4 items-start justify-start flex">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="custom events">Custom Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                            <div className="bg-black border-white/10 border text-white text-center">
                                <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/10 ">TOTAL VISITS</p>
                                <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                    {abbreviateNumber(totalVisits?.length)}
                                </p>
                            </div>
                            <div className="bg-black border-white/10 border text-white text-center">
                                <p>PAGE VIEWS</p>
                            </div>
                        </div>
                        
                    </TabsContent>
                    <TabsContent value="custom events">Change your password here.</TabsContent>
                </Tabs>
                </div>}
        </div>
    )
}