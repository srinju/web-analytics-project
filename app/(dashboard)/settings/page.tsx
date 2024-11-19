import AppBar from "@/app/components/AppBar";
import SettingsPageClient from "@/app/components/SettingsPageClient";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";


export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    if(!session){
        return null;
    }
    
    return (
        <div className="">
            <SettingsPageClient session={{
                id : session.user.id,
                name : session.user.name,
                email : session.user.email,
                password : session.user.password,
                apikey : session.user.apikey
            }} />
        </div>
    )
}