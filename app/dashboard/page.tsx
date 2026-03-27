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

    function handleAddExercise(exercise: Exercise) {
        setSelectedExercises((prev)=> [...prev, exercise]); // create a new array, inserting the new exercise at the end of the old exercise array 
    }

    function handleRemove(id: Number) {
        setSelectedExercises((prev) => 
         prev.filter((exercise) => exercise.id !== id)  // only keep the exercises whose id does not match the one we want to remove 
     ); 
    }

    return(
        <div> 
            <main> 
                <div> {/* {condition} ? (if condition is true, do this) : (else, do this) */}
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


                             <div> {/* Search area */ }
                                <input
                                value={exerciseSearch}
                                type="text"
                                placeholder="Search Exercise"
                                onChange={(e)=> setExerciseSearch(e.target.value)}
                                />

                                <button type="button" onClick={handleExerciseSearch}> Search </button>
                            </div>
                            
                            <div>  {/* Results area */ }
                                {exerciseResults.map((exercise)=> (
                                    <div key={exercise.id}> 
                                        <p> {exercise.name} </p>
                                        <button
                                        type="button"
                                        onClick={()=> handleAddExercise(exercise)}
                                        > 
                                        Add
                                        </button>
                                    </div> 
                                ))}
                            </div> 

                            <div> {/* show selected exercises */}
                                <h3> Selected Exercises </h3>
                                {selectedExercises.map((exercise)=> (
                                    <div key={exercise.id}> 
                                        <p> {exercise.name} </p>

                                        <button
                                        onClick={()=> handleRemove(exercise.id)}
                                        type="button"
                                        > 
                                        Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                             
                             <div> 
                                
                                <button
                                onClick = {()=>{
                                    setShowAddWorkout(false); 
                                    setWorkoutName(""); 
                                    setWorkoutLabel(""); 
                                    setExerciseSearch(""); 
                                }}
                                > Cancel 
                                </button>

                                <button> Continue </button>
                            </div> 
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}