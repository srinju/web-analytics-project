"use client"

import AppBar from "@/app/components/AppBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Loader from "@/app/components/Loader";
  

interface WebsiteClientProps {
    //website : string,
    //websites : any,
    session : {
        name : string,
        email : string,
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

interface groupedPageViewsSourcesProps {
    source : string | null,
    visits : number
}

interface CustomEvent {
    event_name: string;
    message: string;
    created_at: Date;
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
    const [customEvents , setCustomEvents] = useState([]);
    const [groupedPageViewsSources] = useState<groupedPageViewsSourcesProps[]>([]);
    const [groupedCustomEvents , setGroupedCustomEvents] = useState([]);
    const router = useRouter();

    const params =  useParams();
    const website =  params.website as string;
    
    useEffect(() => {
        console.log("use effect mounted!!");
        if(!session) {
            return redirect('/api/auth/signin');
        }
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
                const customEventsData = data.events;
                setPageViews(data.views || []);
                setGroupedPageViews(groupPageViews(data.views || []));
                setTotalVisits(data.visits || []);
                setCustomEvents(data.events);
                setCustomEvents(customEventsData);
                setGroupedCustomEvents( //group the custom events by name 
                    customEventsData.reduce((acc : Record<string, number>, event : { event_name: string }) => {
                    acc[event.event_name] = (acc[event.event_name] || 0) + 1;
                    return acc;
                    }, {})
                );
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

    },[session,website,router]);

    

    //This function groups URLs by page path and counts the number of visits per path, returning a simplified list of unique pages and their respective visit counts.

    function groupPageViews(pageViews : PageView[]):GroupedPageView[] {
        const groupedPageViews : Record<string, number> = {};
        pageViews.forEach(({page})  => {
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

    const formatTimeStamp = (date : Date) => {
        const formattedTimeStamp = date.toLocaleString();
        return formattedTimeStamp;
    }

    if(loading) {
        return <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
            <AppBar name = {session.name}/>
            <div className="min-h-screen w-full items-center justify-center flex text-white relative">
                <Loader />
            </div>
        </div>
    }

    return(
        <div className="bg-black text-white min-h-screen w-full items-center justify-center flex flex-col">
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
             </div> :
             <div className="z-40 w-[95%] md:w-3/4 lg:2/3 min-h-screen py-6 border-x border-white/10 items-center justify-start flex flex-col">
              <div className="w-full justify-center flex items-center">
                <Tabs defaultValue="general" className="w-full items-center justify-center flex flex-col">
                    <TabsList className="w-full bg-transparent mb-4 items-start justify-start flex">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="custom events">Custom Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="w-full">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                            <div className="bg-black border-white/10 border text-white text-center">
                                <p className="text-white/70 font-bold py-8 w-full text-center border-b border-white/10  ">TOTAL VISITS</p>
                                <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#1c1c1c]">
                                    {abbreviateNumber(totalVisits?.length)}
                                </p>
                            </div>
                            <div className="bg-black border-white/10 border text-white text-center">
                                <p className="text-white/70 font-bold py-8 w-full text-center border-b border-white/10 ">PAGE VIEWS</p>
                                <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#1c1c1c]">
                                    {abbreviateNumber(pageViews?.length)}
                                </p>
                            </div>
                        </div>
                        <div className="items-center justify-center grid grid-cols-1 bg-black lg:grid-cols-2 mt-12 w-full border-y border-white/10">
                            {/* TOP PAGES*/}
                            <div className="flex flex-col bg-black z-40 h-full w-full">
                                <h1 className="text-white/70 py-6 w-full text-center border-b border-white/10">Top Pages</h1>
                                {groupedPageViews.map(view => (
                                    <div key={view.page}  className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/10 flex">
                                        <div>
                                            <p>{view.page}</p>
                                        </div>
                                        <div>
                                            <p>{abbreviateNumber(view.visits)}</p>
                                        </div>
                                    </div>    
                                ))}
                            </div>
                            {/*TOP SOURCES*/}
                            <div className=" flex flex-col bg-black z-40 h-full w-full lg:border-1 border-t lg:border-t-0 border-white/10">
                                <h1 className="text-white/70 py-6 w-full text-center border-b border-white/10">
                                    Top Visit Sources
                                    <p className="absolute bottom-2 right-2 text-[10px] italic font-light">add ? utm={"{source}"} to track</p>
                                </h1>
                                {groupedPageViewsSources.map((pageSource : groupedPageViewsSourcesProps) => (
                                    <div
                                        key={pageSource.source}
                                        className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/10 flex"
                                    >
                                        <p className="text-white/70 font-light">
                                            /{pageSource.source}
                                        </p>
                                        <p className="text-white/70 font-light">
                                            <p className="">
                                                {abbreviateNumber(pageSource.visits)}
                                            </p>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="custom events" className="w-full">
                    {groupedCustomEvents && <Carousel className="w-full px-4">
                            <CarouselContent>
                                {Object.entries(groupedCustomEvents).map(
                                    ([eventName  , count]) => (
                                        <CarouselItem 
                                            key={`${eventName}-${count}`}
                                            className="basis-1/2"
                                        >
                                            <div className="bg-black smooth group hover:border-white/20 text-white text-center border" >
                                                <p className="text-white/70 font-medium py-8 w-full group-hover:border-white/20 smooth text-center border-b ">                                                                                                              
                                                    {eventName}
                                                </p>
                                                <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                                    {count}
                                                </p>
                                            </div>
                                        </CarouselItem>
                                    )
                                )}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>}
                        <div className="items-center justify-center bg-black mt-12 w-full border-y border-white/10 relative">
                                {customEvents.map((event : CustomEvent , index : number) => (
                                    <div
                                        key={`${event.event_name}-${index}`} 
                                        className="text-white w-full items-start justify-start px-6 py-12 border-b border-white/10 flex flex-col relative">
                                        <p className="text-white/70 font-light pb-3">{event.event_name}</p>
                                        <p>{event.message}</p>
                                        <p className="italic absolute right-2 bottom-2 text-xs text-white/50">{formatTimeStamp(event.created_at)}</p>
                                    </div>
                                ))}
                        </div>
                    </TabsContent>
                </Tabs>
                </div>
            </div>
                }           
        </div>
    )
}