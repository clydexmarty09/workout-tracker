"use client"; 
import { useState, useEffect } from "react"

export default function progress() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false) ; 
    const [exercises, setExercises] = useState<any[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
    const [progressSets, setProgressSets] = useState<any[]>([]); 

    const fetchExercise = async() => {
        

        try {
            setError(""); 
            setLoading(true); 
            const res = await fetch(`/api/exercises`)
            const data = await res.json() ; 

            if (!res.ok) {
                setError(data.error || "Cannot fetch exercises") ; 
                return; 
            }

            setExercises(data)

        } catch {
            setError("Cannot fetch progress.")
        }  finally {
            setLoading(false); 
        }

    }           
    
    const fetchExerciseProgress = async(exercise: any) => {
        try {

            setError(""); 
            setLoading(true); 
            const res = await fetch(`/api/progress/exercises/${exercise.id}`); 
            const data = await res.json() 

            if(!res.ok) {
                setError(data.error || "Cannot fetch progress for exercise") ; 
                return; 
            }

            setProgressSets(data)

        } catch {
            setError("Cannot fetch progress for exercise"); 
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {   
        fetchExercise(); 
    }, [])



    return (
        <main> 
            

            <section> 
                {exercises.map((exercise)=> (
                    <button key={exercise.id} type="button">
                        {exercise.name}
                    </button>
                ))}
            </section>

            
      
        </main> 
    )
}