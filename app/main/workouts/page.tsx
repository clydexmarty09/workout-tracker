"use client"; 
import { useState } from "react"; 

export default function Exercises() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const [workouts, setWorkouts] = useState<any[]>([]);
    const [workoutName, setWorkoutName] = useState<string>(""); 
    const [selectedExercises, setSelectedExercises] = useState<any[]>([]); 
    const [label, setLabel]= useState(""); 
    
    async function handleDeleteWorkout(id: string) {
        try {

            setLoading(true); 

            const res = await fetch(`/api/workouts/${id}`, {
                method: "DELETE"
            }); 

            if(!res.ok) {
                setError("Failed to delete workout")
                console.log(error); 
            }

            setError(""); 
            await fetchWorkouts(); 

        } catch {
            setError("Failed to delete workout")
        } finally {
            setLoading(false); 
        }
    }

    async function handleCreateWorkout() {
        try {
            setLoading(true); 
            setError(""); 

            const res = await fetch(`/api/workouts`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({ name: workoutName, label: label, exerciseIds: selectedExercises.map(e=> e.id)} )
            }); 

            const data = await res.json(); 
            if(!res.ok) {
                setError(data.error || "Cannot create workout"); 
                return; 
            }

            setWorkoutName(""); 
            setSelectedExercises([]); 

        } catch (error) {
            setError("Cannot add workout")
        } finally { 
            setLoading(false); 
        }
    }


    async function fetchWorkouts() {
       
        try {

            setLoading(true); 

            const res = await fetch(`/api/workouts`); 
            const data = await res.json(); 

            if(!res.ok) {
                setError("Cannot fetch workouts"); 
                return; 
            }

            setWorkouts(data);
            console.log(data); 
            setError(""); 

        } catch {
            setError("Cannot fetch workouts"); 
        } finally {
            setLoading(false); 
        }
    }
    return (
        <main className="min-h-dvh bg-black text-white">
            <div className="flex flex-col gap-4 p-4 mx-auto max-w-md">

                <h1> It works! </h1>
            </div> 
        </main>
    )
}