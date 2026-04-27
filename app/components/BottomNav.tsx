"use client"; 

import Link from "next/link"; 
import { usePathname } from "next/navigation";  // lets us know what page the user is on 

export default function BottomNav() {
    const pathname = usePathname();   // store the current path url 

    return (
        <nav> 
            <div> 
                <Link
                href="/main/front-page"
                > 
                HOME
                </Link>

                <Link
                href="/main/exercises"
                > 
                EXERCISES
                </Link>

                <Link
                href="/main/workouts"
                > 
                WORKOUTS
                </Link>
            </div>
        </nav>
    ); 
}