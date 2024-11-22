"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import AppBar from "./AppBar";
import { CodeComp } from "./CodeComp";
import Loader from "@/app/components/Loader";

interface SettingsPageClientProps  {
    session : {
        name : string,
        email : string,
        password : string,
        id : string,
        apikey : string
    }
}

export default function SettingsPageClient({session} : SettingsPageClientProps) {

    const [loading , setLoading] = useState(false);
    const [apikey , setApikey] = useState("");
    const [buttonText , setButtonText] = useState("Copy API Key");
    const router = useRouter();

    useEffect(() => {
        if(!session) {
            router.push('/api/auth/signin');
        }
    },[session,router]);

    //this api checks if there is api key for your account , if there is not then it creates one for you.
    const getUserAPI = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/getUserApi', {
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json'
                }
            });
            const data = await response.json();
            if(response.ok){
                setApikey(data.apikey);
            } else {
                console.error("an unexpected error occured!!");
            }
        } catch (error) {
            console.error("an erorr occured while getting the api key of the user" , error);
        } finally {
            setLoading(false);
        } 
    }

    const generateApiKey = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generateApiKey',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                }
            });
            const data = await response.json();
            if(response.ok){
                setApikey(data.apikey);
            } else {
                console.error("an unexpected error occured " , data.error);
            }
        } catch(error){
            console.error("an error occured while generating the api key ", error);
        } finally {
            setLoading(false);
        }
    }

    const copyApiKey = () => {
        navigator.clipboard.writeText(apikey).then(
            () => {
                setButtonText("Copied");
                setTimeout(() => {
                    setButtonText("Copy API Key")
                },5000);
            },
            (err) => {
                console.error("failed to copy text ",err);
            }
        )
    }

    useEffect(() => {
        if(!session) {
            return;
        }
        getUserAPI();
    },[session]);

    if(loading) {
        return <div className="bg-black min-h-screen w-full items-center text-3xl font-bold ">
            <AppBar name={session.name} />
            <div className="min-h-screen w-full font-bold text-3xl items-center justify-center flex text-white relative animate-pulse">
                <Loader />
            </div>
        </div>
    }

    return (
        <div className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
            <AppBar name={session.name} />
            <div className="min-h-screen items-center justify-center flex flex-col w-full z-40 text-white">
                {!apikey && !loading && 
                    <button 
                        type="button" 
                        onClick={generateApiKey} 
                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            Generate API Key
                    </button> }
                    {apikey && <div className="mt-12 border-white/10 border bg-[#131313] space-y-12 lg:w-1/2  py-12 w-full  md:w-3/4 ">
                        <div className="space-y-12 px-4 items-center">
                            <p>Your API Key :</p>
                            <input 
                                type="text"
                                readOnly
                                disabled 
                                className="outline-none border-b border-white/20 w-full px-4 py-1 bg-[#252525]" 
                                value={apikey}
                            />                           
                            <button 
                                type="button" 
                                onClick={copyApiKey} 
                                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 justify-center">
                                    {buttonText}
                            </button>                                                 
                        </div>
                        <div className="space-y-4 border-t border-white/10 bg-[#131313] p-6">
                            <h1>You can Create Custom events using Our API as instructed below :-</h1>
                            <p className="text-sm text-red-500">Copy the Code</p>
                            <div>
                                <CodeComp />
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    )
}