import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";


export default async function useUser() {
    const session = await getServerSession(authOptions);
    if(!session) {
        return null;
    }
    return session;
}