"use client"; 
import { useEffect, useState } from "react"; 
import { useParams } from "next/navigation";

export default function SessionId() {

    const [session, setSession] = useState([])
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); 

    const params = useParams(); 
    const id = params.id; 

    async function fetchWorkouts() {
        
        try {
            
            setLoading(true); 
            const res = await fetch(`/api/workout-sessions/${id}`); 
            const data = await res.json()
            
            setSession(data); 


        } catch (e: any){
            setError(e); 
            return; 

        } finally {
            setLoading(false); 
        }
    }

    useEffect(()=> {
        fetchWorkouts(); 
    }, [])

    return (
        <main> 
            <div> 
                <h1> TEST </h1>
            </div>
        </main>
    )
}