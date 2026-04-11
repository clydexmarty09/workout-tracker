"use client"; 
import Link from "next/link"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"  


export default function Login() {

    const [login, setLogin] = useState("")
    const [pw, setPw] =  useState("")
    const [error, setError] = useState("")
    const router = useRouter(); 

    async function handleLogin(e: any) {
        e.preventDefault();
        setError(""); 

        const response = await fetch("/api/auth/login", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
            }, 
            body: JSON.stringify({
                login, pw, 
            }), 
        }); 

        const data = await response.json(); 
        if(!response.ok) {
            setError(data.error || "Login failed"); 
            return; 
        }

        router.push("/front-page"); 
    }

    return(
          <div className="landing-outer"> 
            <main className="landing-inner"> 
                <h1 className="text-left font-bold text-3xl"> LOGIN </h1>
                
                <form onSubmit={handleLogin}> 
                    <div className="flex flex-col gap-2"> 
                        <input
                        className="input"
                        placeholder="Username or Email"
                        type="text"
                        value={login}
                        onChange={(e)=> setLogin(e.target.value)}
                        />

                        <input
                        className="input"
                        placeholder="Password"
                        type="password"
                        value={pw}
                        onChange={(e)=> setPw(e.target.value)}
                        />

                        { error && <p className="text-red-500 text-sm"> { error} </p> }

                        <button className="btn"> Log In</button>
                    </div>
                </form>

                <p><Link href="register" className="text-blue-500"> Register</Link> instead </p>
            </main> 
        </div> 
    )
}