import AppBar from "@/app/components/AppBar";
import { getWebsites } from "@/app/lib/actions/getWebsites";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";


export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if(!session){
        return null
    }
    const userid = session.user.id
    const websites = await getWebsites(userid);
    if(!websites) {
        return null;
    }

    return(
        <div className="bg-black min-h-screen h-full w-full relative items-center justify-center flex flex-col">
            <AppBar name={session.user.name}/>
            <div className="w-full items-start justify-start flex flex-col min-h-screen">
                <div className=" w-full items-center justify-end flex p-6 border-b border-white/20 z-40">
                    <Link href={'/add'} prefetch>
                        <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">+ Add Website </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-10 p-6 z-40">
                    {websites.map(website => (
                        <Link key={website.id} href={`/w/${website.website_name}`}>
                            <div className="border border-white/15 rounded-md py-12 px-6 text-white bg-black w-full cursor-pointer smooth hover:border-white/40 hover:bg-[#242424] ">
                                <h2>{website.website_name}</h2>
                            </div>
                        </Link>
                    )) }
                </div>
            </div>
        </div>
    )
}