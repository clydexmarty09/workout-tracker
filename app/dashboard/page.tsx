"use client"; 
import { useState } from "react"; 

// we need this because the results are objects 
type Exercise = {
    id: number; 
    name: string; 
}

type Workout = {
    id: number; 
    name: string; 
    label: string | null; 
}

export default function DashBoard() {

    const [showAddWorkout, setShowAddWorkout] = useState(false); 
    const [workoutName, setWorkoutName] = useState(""); 
    const [workoutLabel, setWorkoutLabel] = useState("");
    const [exerciseSearch, setExerciseSearch] = useState("") // stores whatever the user types in the search box 
    const [exerciseResults, setExerciseResults] = useState<Exercise[]>([]);  // stores the matches the come back from API route
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])  // stores the exercises the user picked for workout
    const [workouts, setWorkouts] = useState<Workout[]>([]); 
    const [loading, setLoading] = useState(false); 

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

    // displays the workouts saved. 
    async function fetchWorkouts() {
        try {

            const res = await fetch("/api/workouts"); 
            const data = await res.json();
            
            setWorkouts(data); 

        } catch (error) {
            console.error("Failed to fetch workouts", error)
        }
    }
    async function handleSaveWorkout() {
        try {   
            const res = await fetch("/api/workouts", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: workoutName, label:workoutLabel, 
                    exerciseIds: selectedExercises.map((exercise)=> exercise.id), 
                 }), 
            }); 

            const data = await res.json(); 
            if(!res.ok) {
                console.error(data.error || "Failed to save workout")
                return null; 
            }

            //success : close the form and clear inputs 
            setShowAddWorkout(false); 
            setWorkoutName(""); 
            setWorkoutLabel(""); 
            setExerciseSearch(""); 
            setExerciseResults([]); 
            setSelectedExercises([]); 


        } catch (error) {
            console.error("Failed to save workout", error); 
        }
    }

    function handleAddExercise(exercise: Exercise) {
        
        setSelectedExercises((prev)=> {
            const exists = prev.some((item)=> item.id === exercise.id);  // check for duplicates 

            if(exists) {
                return prev; 
            }

            return [...prev, exercise]; 
        }); 
    }

    function handleRemove(id: number) {
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
                                <h3> Search Results </h3>
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
                                    setExerciseResults([]); 
                                    setSelectedExercises([]); 
                                }}
                                > Cancel 
                                </button>

                                <button
                                type="button"
                                onClick={handleSaveWorkout}
                                > Save Workout 
                                </button>

                                <div>
                                    <button
                                    type="button"
                                    onClick={fetchWorkouts}
                                    >
                                        Show Workouts
                                    </button>

                                    {workouts.map((w:any) => (
                                        <div key={w.id}>
                                            <h2> {w.name} </h2>
                                        </div> 
                                    ))}
                                </div>
                           
                            </div> 
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}