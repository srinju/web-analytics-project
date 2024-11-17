"use client"

import { redirect, useParams } from "next/navigation";

interface WebsiteClientProps {
    website : string,
    websites : any,
    session : {
        name : string,
        email : string,
        password : string,
        id : string
    }
}

export default function WebsiteClient({website , websites , session} : WebsiteClientProps) {
    //const params  = useParams();
    //website gets the current domain of the user for monitoring reads
    //websites is for all the website data(not really needed)
    //session is for the current user session 

    if(!session) {
        return redirect('/api/auth/signin');
    }

    return(
        <div>
            <p>website : {website}</p>
            <p>name : {session.name}</p>
        </div>
    )
}