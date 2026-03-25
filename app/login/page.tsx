"use client"; 
import Link from "next/link"; 
import { useState } from "react"; 

export default function Login() {

    const [user, setUser] = useState("")
    const [pw, setPw] =  useState("")

    return(
         <div className="overflow-hidden min-h-dvh"> 
            <main className="w-full p-4 max-w-sm mx-auto"> 
                <h1 className="text-left font-bold text-2xl"> LOGIN </h1>
                
                <form> 
                    <div className="flex flex-col gap-2"> 
                        <input
                        className="input"
                        placeholder="Username"
                        type="text"
                        value={user}
                        onChange={(e)=> setUser(e.target.value)}
                        />

                        <input
                        className="input"
                        placeholder="Password"
                        type="text"
                        value={pw}
                        onChange={(e)=> setPw(e.target.value)}
                        />

                        <button className="btn"> Log In</button>
                    </div>
                </form>

                <p><Link href="register" className="text-blue-500"> Register</Link> instead </p>
            </main> 
        </div> 
    )
}