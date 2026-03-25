"use client"; 
import { useState } from "react"; 
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 

export default function Register() {

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [user, setUser] = useState(""); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const router = useRouter(); 

    
    async function handleSubmit(e: any) {
       
        e.preventDefault(); 
        setError(""); 
        setLoading(true); 

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body:JSON.stringify({
                    email, pw, user, 
                })
            }); 

            const data = await res.json(); 
           
            if(!res.ok) {
                setError(data.error || "Registration failed"); 
                return; 
            }

            console.log(data); 
            router.push("/login")

        } catch {
            setError("Failed to register"); 
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div className="overflow-hidden min-h-dvh"> 
            <main className="w-full p-4 max-w-sm mx-auto"> 
                <h1 className="text-left font-bold text-2xl"> REGISTER </h1>
                
                <form onSubmit={handleSubmit}> 
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
                        type="password"
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

                        <button className="btn" type="submit"> Register</button>
                    </div>
                </form> 

                <p> <Link className="text-blue-500" href="login"> Login </Link> instead </p> 
                
            </main>
        </div>
    )
}