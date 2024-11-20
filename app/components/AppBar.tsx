"use client"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowRightIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


export default function AppBar({name,image}:any) {
    //const user = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const logout = async () => {
        signOut({callbackUrl : '/'})
    }
    return (
        <div className=" w-full border-b border-white/20 sticky top-0 bg-slate-800 z-50 bg-opacity-20 filter backdrop-blur-lg flex items-center justify-between px-6 ">
            {/*Logo*/}
            <p className="text-2xl text-white italic font-extrabold">WebWise</p>
            <div className="flex  space-x-6">
                {pathname !== '/dashboard' && <div className="items-center flex space-x-4">
                    <button className="text-sm text-white/60 hover:text-white smooth cursor-pointer" onClick={() => {
                        router.push('/snippet');
                    }}>Snippet</button>
                    <Link prefetch href={'/dashboard'} className="flex items-center justify-center space-x-2 group">
                        <button className="text-sm text-white/60 group-hover:text-white smooth">Dashboard</button>
                        <ArrowRightIcon className="h-4 w-4 stroke-white/60 group-hover:stroke-white smooth" />
                    </Link>
                </div>}
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-white outline-none p-0 m-9 border-none">
                        <div className="flex space-x-2 items-center hover:opacity-50">
                            <p className="text-sm">{name?.split(" ")[0]}</p>
                            <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{name?.split(" ")[0][0].toUpperCase()}</span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0a0a0a] border-white/5 outline-none text-white bg-opacity-20 backdrop-blur-lg filter">
                        <DropdownMenuLabel className="text-white">
                            Settings
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <Link
                        href={'/settings'} prefetch>
                            <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md">
                                API
                            </DropdownMenuItem>
                        </Link>
                        <Link href={'/settings'} prefetch>
                            <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md">
                                Guide
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator className="bg-white/5" />
                        
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-white/60 smooth cursor-pointer rounded-md">
                            Logout
                        </DropdownMenuItem>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}