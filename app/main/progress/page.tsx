"use client"; 
import { useState, useEffect } from "react"

export default function progress() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false) ; 
    const [exercises, setExercises] = useState<any[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
    const [progressSets, setProgressSets] = useState<any[]>([]); 

    const fetchExerciseProgress = async() => {
        

        try {
            setError(""); 
            setLoading(true); 
            const res = await fetch(`/api/progress/exercises`)
            const data = await res.json() ; 

            if (!res.ok) {
                setError(data.error || "Cannot fetch exercises") ; 
                return; 
            }

        } catch {
            setError("Cannot fetch progress.")
        }  finally {
            setLoading(false); 
        }

    }

    useEffect(() => {
        fetchExerciseProgress(); 
    }, [])



    return (
        <main> 
            
            
      
        </main> 
    )
}