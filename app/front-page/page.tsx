"use client"; 
import { useState } from "react"; 

export default function FrontPage() {

    const [exercisesName, setExerciseName] = useState(""); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [exercises, setExercises] = useState([]); 

    async function handleAddExercise() {


    }

    return (
        <main> 
            <h1> SOME TEXT HERE </h1>
           
            <form> 
                <input 
                value={exercisesName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Insert exercises name"
                type="text"
                />

                <button type="button" onClick={handleAddExercise}> Add Exercises </button> 
            </form>
        </main>
    )
}