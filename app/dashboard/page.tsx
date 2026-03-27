"use client"; 
import { useState } from "react"; 

// we need this because the results are objects 
type Exercise = {
    id: number; 
    name: string; 
}

export default function DashBoard() {

    const [showAddWorkout, setShowAddWorkout] = useState(false); 
    const [workoutName, setWorkoutName] = useState(""); 
    const [workoutLabel, setWorkoutLabel] = useState("");
    const [exerciseSearch, setExerciseSearch] = useState("") // stores whatever the user types in the search box 
    const [exerciseResults, setExerciseResults] = useState<Exercise[]>([]);  // stores the matches the come back from API route
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])  // stores the exercises the user picked for workout

    // Frontend -> API -> DB -> API -> frontend 
    async function handleExerciseSearch() {
        try {
            // make a request to URL and encode it to prevent broken URLS 
            const res = await fetch(`/api/exercises?search=${encodeURIComponent(exerciseSearch)}`); 

            const data = await res.json(); 
            if(!res.ok) {
                console.error(data.error || "Search failed"); 
                return; 
            }

            setExerciseResults(data)
        
        } catch (error) {
            console.error("Search failed.", error); 
        }
    }

    return(
        <div> 
            <main> 
                <div> 
                    {!showAddWorkout ? (
                        <button onClick={()=>setShowAddWorkout(true)}> Add Workout </button>
                    ) : (
                        <div> 
                            <h2> Create workout </h2>
                            
                            <input
                            value={workoutName}
                            type="text"
                            placeholder="Workout Name"
                            onChange={(e)=> setWorkoutName(e.target.value)}
                            />

                            <input
                             value={workoutLabel}
                             type="text"
                             placeholder="Label (optional)"
                             onChange={(e)=> setWorkoutLabel(e.target.value)}
                             />

                             <div> 
                                <button> Cancel </button>
                                <button> Continue </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}