import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import { authOptions } from "../lib/auth";


export default async function useUser() {
    const [session,setSession] = useState("");
    const catchUser = async () => {
        const usersession = await getServerSession(authOptions);
        setSession(usersession ?? " ");
    }
    useEffect(() => {
        catchUser()
    },[]);
    return [session];
}