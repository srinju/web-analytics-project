import WebsiteClient from "./WebsiteClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";


export default  async function WebsitePage() {
    //const {data : session} = useSession();
    const session = await getServerSession(authOptions);
    //const {Website} = useParams(); //in dynamic route whenever the user clicks on the website of them then it comes to this page and the {website} catches the website url with the useparams
   
    return <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
        <WebsiteClient  session={{
            id : session.user.id,
            name : session.user.name,
            email : session.user.email,
        }}/>
    </div>
}