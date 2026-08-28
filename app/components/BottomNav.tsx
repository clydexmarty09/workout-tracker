"use client"; 

import Link from "next/link"; 
import { useState } from "react"; 
import { usePathname, useRouter } from "next/navigation";  // lets us know what page the user is on 

export default function BottomNav() {
    const pathname = usePathname();   // store the current path url 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<string>(""); 
    const router = useRouter(); 
    

    async function handleLogout() {
        try {

            setError(""); 
            setLoading(true); 

            const res = await fetch(`/api/auth/logout`, 
                {
                    method: "POST"
                }
            ); 

            if (!res.ok) {
                setError("Log out failed")
                return; 
            }

            router.push('/login'); 

        } catch {
            setError("Unauthorized"); 
        } finally {
            setLoading(false); 
        }
    }

    return (
        <nav className="fixed z-50 bottom-0 left-0 w-full border-t bg-black"> 
            <div className="flex justify-around items-center max-w-md mx-auto h-16"> 
                <Link
                className={`flex flex-col items-center text-xs font-medium transition
                 ${pathname === "/main/front-page" ? "text-green-500" : "text-gray-400"}   
                `}
                href="/main/front-page"
                > 
                HOME
                </Link>

                <Link
                className={`flex flex-col items-center text-xs font-medium transition
                 ${pathname === "/main/exercises" ? "text-green-500" : "text-gray-400"}   
                `}
                href="/main/exercises"
                > 
                EXERCISES
                </Link>

                <Link
                className={`flex flex-col items-center text-xs font-medium transition
                 ${pathname === "/main/workouts" ? "text-green-500" : "text-gray-400"}   
                `}
                href="/main/workouts"
                >
                     
                WORKOUTS
                </Link>
                <Link
                className={`flex flex-col items-center text-xs font-medium transition
                 ${pathname === "/main/progress" ? "text-green-500" : "text-gray-400"}   
                `}
                href="/main/workouts"
                
               
                > 
                 PROGRESS
                 </Link>

                <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex flex-col items-center text-xs font-medium transition ${
                        pathname === "/login" ? "text-green-500" : "text-gray-400"
                    }`}
                >   
                    LOGOUT
                </button>
            </div>
        </nav>
    ); 
}