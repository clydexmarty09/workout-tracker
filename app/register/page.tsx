"use client"; 
import { useState } from "react"; 
import Link from "next/link"; 

export default function Register() {

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [user, setUser] = useState(""); 
    

    return (
        <div className="overflow-hidden min-h-dvh"> 
            <main className="w-full p-4 max-w-sm"> 
                <h1 className="text-left font-bold text-2xl"> REGISTER </h1>
                
                <form> 
                    <div className="gap-2 flex flex-col"> 
                        <input
                        className="input"
                        type="text"
                        placeholder="Username"
                        value={user}
                        onChange={(e)=> setUser(e.target.value)}
                        />

                        <input
                        className="input"
                        type="text"
                        placeholder="Password"
                        value={pw}
                        onChange={(e)=> setPw(e.target.value)}
                        />

                        <input
                        className="input"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        />  

                        <button className="btn" type="submit"> REGISTER </button>
                    </div>
                </form> 

                <p> <Link className="text-blue-500" href="login"> Login </Link> instead </p> 
                
            </main>
        </div>
    )
}