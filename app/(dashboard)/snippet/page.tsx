import AppBar from "@/app/components/AppBar";
import { CodeComp } from "@/app/components/CodeComp";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";


export default async function Snippet() {
    
    const session = await getServerSession(authOptions);
    if(!session) return null;

    return (
        <div className="bg-black w-full min-h-screen">
            <AppBar name={session.user.name} />
            <div className="space-y-4 border-t border-white/10 bg-[#131313] p-6">
                <h1 className="text-white">You can Create Cusotom using Our API as instructed below :-</h1>
                <p className="text-sm text-red-500">Copy the Code for Custom Events</p>
                <div>
                    <CodeComp />
                </div>
            </div>
        </div>
    )
}