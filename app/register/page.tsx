"use client"; 
import { useState } from "react"; 

export default function Register() {

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [user, setUser] = useState(""); 
    

    return (
        <div className="min-h-dvh bg-gray-300/60"> 
            <main className="w-full p-4 max-w-sm"> 
                <h1 className="text-left font-bold text-2xl"> REGISTER </h1>
                
                <div className="gap-2 flex flex-col"> 
                    <input
                    className="p-1 border border-gray-500 rounded-md w-full"
                    type="text"
                    placeholder="Username"
                    value={user}
                    onChange={(e)=> setUser(e.target.value)}
                    />

                    <input
                     className="p-1 border border-gray-500 rounded-md w-full"
                     type="text"
                     placeholder="Password"
                     value={pw}
                     onChange={(e)=> setPw(e.target.value)}
                     />

                     <input
                      className="p-1 border border-gray-500 rounded-md w-full"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}
                      />  
                </div> 
                
            </main>
        </div>
    )
}