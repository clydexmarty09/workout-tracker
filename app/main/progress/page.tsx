"use client"; 
import { useState } from "react"

export default function progress() {

    const [error, setError] = useState("");
    const [exercises, setExercises] = useState<any[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
    const [progressSets, setProgressSets] = useState<any[]>([]); 

    const fetchExerciseProgress = async() => {
        
        try {
            // const res = await fetch(`/api/progress/exercises/${exercise.id}`)

        } catch {
            setError("Cannot fetch progress.")
        }   

    }



    return (
        <main> 
            
            
      
        </main> 
    )
}