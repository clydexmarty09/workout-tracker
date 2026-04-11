"use client"; 
import { useState } from "react"; 

export default function FrontPage() {

    const [exerciseName, setExerciseName] = useState(""); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [exercises, setExercises] = useState<any[]> ([]); 

    // for creating workouts 
    const [selectedExercises, setSelectedExercises] = useState<any[]>([]); 

    async function handleAddExercise() {

        try {
            const res = await fetch(`/api/exercises`,  // send request to backend route 
                {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"  // format of the request body 
                    }, 
                    body : JSON.stringify({ name: exerciseName })  // take JS object and convert to a JSON string 
                }, 
            );

            const data = await res.json(); // reads JSON data the backend sent back 
            
            if(!res.ok) {
                setError(data.error || "Cannot add exercise"); 
                return; 
            }

            setExerciseName(""); 
            setError(""); 
            await fetchExercises(); 

        } catch (error) {
            setError("Cannot add exercise"); 
        }
    }

    async function fetchExercises() {
        try {

            setLoading(true); 
            const res = await fetch(`/api/exercises`); 
            const data = await res.json(); 
            
            if (!res.ok) {
                setError("Cannot fetch exercises ")
                return; 
            }

            setExercises(data); 
            console.log(data); 
            setError(""); 
       
        } catch {
            setError("Cannot fetch exercises"); 
        } finally {
            setLoading(false); 
        }
    }

    function addToWorkout(exercise: any) {
        setSelectedExercises((prev)=> [...prev, exercise])
    }

    return (
        <main> 
            <h1> SOME TEXT HERE </h1>
           
            <form> 
                <input 
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Insert exercises name"
                type="text"
                />

                <button type="button" onClick={handleAddExercise}> Add Exercises </button> 
            </form>

            <div> 
                <button type="button" onClick={fetchExercises}> Show exercises</button>
               
                { loading && <p> Loading ... </p>}
                { error && <p> { error} </p>}
                { exercises.map((e)=> (
                    <div key={e.id}> 
                        <p> {e.name} </p>
                        <button type="button" onClick={()=>  addToWorkout(e)}> Add to workout </button>
                    </div> 
                ))}
                
            </div>

            <div> 
                <h2> Current Workout </h2>
                { selectedExercises.map((exercise)=> (
                    <div key={exercise.id}> 
                        <p> { exercise.name} </p>
                    </div> 
                ))}
            </div>
        </main>
    )
}