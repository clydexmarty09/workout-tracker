"use client"; 
import { useState } from "react"; 

export default function Exercises() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const [exerciseName, setExerciseName] = useState(""); 
    const [exercises, setExercises] = useState<any[]> ([]);      
    const [showAddExercise, setShowAddExercise] = useState(false); 
     
    async function fetchExercises() {
        try {

            setLoading(true);  // because fetching takes time 
            const res = await fetch(`/api/exercises`); 
            const data = await res.json(); 
            
            if (!res.ok) {
                setError(data.error || "Cannot fetch exercises ")
                return; 
            }

            setExercises(data); 
            console.log(data); 
            setError(""); 
       
        } catch {
            setError("Cannot fetch exercises"); 
        } finally {
            setLoading(false);  // turn off loadinf after request 
        }
    }
    
    async function handleAddExercise() {

        // check frontend for duplicates 
        const duplicate = exercises.some(
            (item)=> item.name.trim().toLowerCase() === exerciseName.trim().toLowerCase()
        ); 

        if(duplicate) {
            setError("Exercise already exists!"); 
            return; 
        }

        setError(""); 
        
        try {
            const res = await fetch(`../api/exercises`,  // send request to backend route 
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

     
    function closeExercises() {
        setExercises([]); 
    }


    return (
        <main className="min-h-dvh bg-black text-white">
            <div className="flex flex-col gap-4 py-4 px-2 mx-auto max-w-md items-center">

                <h1 className="text-center"> It works! </h1>
                <h3> test</h3>

            <section className="p-3">
           
                <div className="card">

                <button
                onClick={()=> setShowAddExercise(prev => !prev)}
                
                > 

                <h2 className="underline text-left text-lg font-semibold"> { showAddExercise ? "Hide" : "Add Exercise+"} </h2>
                
                </button>

                
                    { showAddExercise && 

                        <form className="flex flex-col gap-5"> 
                            <h3 className="text-md"> Add an exercise:  </h3>
                            <input
                            className="border border-amber-50 rounded-md p-1 w-full" 
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            placeholder="Insert exercise name"
                            type="text"
                            />

                            <button className="btn" type="button" onClick={handleAddExercise}> Add Exercises </button> 
                            
                        </form>
                        
                    }
                
                </div> 
            </section>
            
            </div> 
        </main>
    )
}