"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default  function AddWebsitePage() {

    const [step,setStep] = useState(1);
    const [website,setWebsite] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const router = useRouter();

    const handleAddWebsite = async () => {
        if(website.trim() == "" || loading) return;
        try {
            setLoading(true);
            const response = await fetch('/api/addWebsite',{
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({website})
            });
            console.log("API repsonse ",response);
            if(response.status === 409){
                setError("This domain is already added!");
            } else if (!response.ok){
                throw new Error("Failed to add Website!!");
            } else {
                //const data = await response.json();
                setError("");
                setLoading(false);
                setStep(2);
            }  
        } catch (error : unknown) {
            if (error instanceof Error) {
                console.error("error occurred while checking domain!!", error.message);
                setError("An error occurred, Please try again!!");
            } else {
                console.error("Unknown error occurred:", error);
                setError("An unexpected error occurred. Please try again!!");
            }
        } 
    }

    useEffect(() => { //more error handling 
        if(
            website.trim().includes("http") ||
            website.trim().includes("https") ||
            website.trim().includes("http : //") ||
            website.trim().includes("https : //") ||
            website.trim().includes("://") ||
            website.trim().includes(":") ||
            website.trim().includes("/") 
        ) {
            setError("Please enter the domain only , i.e : (google.com)");
        } else {
            setError("");
        }
    },[website]);
    
    return (
        <div className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
            <h1 className="text-5xl text-white/60 bg-black text-center">WebWise</h1>
            <div className="items-center justify-center p-12 mt-10 flex flex-col w-full z-0 border-y border-white/20 bg-black text-white">
                {step == 1 ? <div className="w-full items-center justify-center flex flex-col spaye-y-10">
                    <span className="w-full lg:w-[50%] group">
                    <p className="text-center text-white/40 pb-4 group-hover:text-white smooth">Domain</p>
                    <input 
                        value={website}
                        onChange={(e)=> setWebsite(e.target.value.trim().toLowerCase())}
                        className="outline-none border-b border-white/20 w-full py-2 pr-4 placeholder:text-white/20 bg-transparent hover:border-white/50 smooth" />
                    {error ? <p className="text-xs pt-2 font-light text-red-400">{error}</p> : <p className="text-xs pt-2 font-light text-white/20">Enter the domain or subdomain of your web appliaction without {"www"}</p>}
                    </span>
                    {error == "" && <button
                        onClick={handleAddWebsite}
                        type="button" className="py-2.5 px-5 my-8 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">{loading ? "adding..." : "add website"}
                    </button>}
                </div> : <div className="w-full items-center justify-center flex flex-col space-y-10">
                    <span className="w-full lg:w-[50%]">
                        <textarea typeof="text" className="outline-none border-b border-white/20 w-full py-2 pr-4 bg-transparent hover:border-white/50 smooth text-white/60 cursor-text" disabled
                            value={`<script defer data-domain="${website}"
                            src="https://webwise-psi.vercel.app/tracking-script.ts"></script>`}
                        />
                        <p className="text-xs text-white/100 pt-3 font-light">
                            Paste this code snippet in the <b className="text-red-600">{"<head>"}</b> of your code base of your website in the index.html file
                        </p>
                    </span>
                    <button 
                        onClick={() => {
                            router.push(`/w/${website.trim()}`)
                        }}
                        type="button"   
                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >Added</button>
                    </div>}
            </div>
        </div>
    )
}