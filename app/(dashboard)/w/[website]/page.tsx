import AppBar from "@/app/components/AppBar";
import { getWebsites } from "@/app/lib/actions/getWebsites";
import { redirect, useParams, useRouter } from "next/navigation";
import WebsiteClient from "./WebsiteClient";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

export default  async function WebsitePage({ params }: { params: { website: string } }) {
    //const {data : session} = useSession();
    const session = await getServerSession(authOptions);
    //const {Website} = useParams(); //in dynamic route whenever the user clicks on the website of them then it comes to this page and the {website} catches the website url with the useparams
   
    
        
    //const websiteData = await getWebsites(session.user.id);//getting the websites for the user

    

    //fetching page views and total visits>>

    /*
    const pageViews = await prisma.page_view.findMany({
        where : {
            domain : params.website,
            userid : session.user.id
        }
    });

    const totalVisits = await prisma.visits.findMany({
        where : {
            website_id : params.website,
            userid : session.user.id
        }
    });
    */

    /*
    const checkWebsiteCurrentUser = async () => { //check website of the current user 
        data?.length == 0 ? redirect('/dashboard') : setTimeout(() => {
            fetchViews();
        },500);
    }
    */

    //This function groups URLs by page path and counts the number of visits per path, returning a simplified list of unique pages and their respective visit counts.
    /*
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

    const groupedPageViews = groupPageViews(pageViews);
    */

    console.log('Page rendering with website ' , params.website);


    return <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
        <WebsiteClient  session={{
            id : session.user.id,
            name : session.user.name,
            email : session.user.email,
            password : session.user.password
        }}/>
    </div>
}