"use client"

import { useParams } from "next/navigation";

interface WebsiteClientProps {
    website : string,
    websites : any
}

export default function WebsiteClient({website , websites} : WebsiteClientProps) {
    const params  = useParams();

    return(
        <div>
            <p>website : {website}</p>
        </div>
    )
}