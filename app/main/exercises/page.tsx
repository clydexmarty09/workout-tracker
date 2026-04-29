"use client"; 
import { useState } from "react"; 

export default function Exercises() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const [exerciseName, setExerciseName] = useState(""); 
    const [exercises, setExercises] = useState<any[]> ([]);      
   
     
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
            <div className="flex flex-col gap-4 p-4 mx-auto max-w-md pb-28">

            <header className="flex items-center justify-between py-2"> 
                <div> 
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400"> Library </p>
                    <h1 className="text-xl font-bold"> Exercises </h1>
                </div>

                <button 
                type="button"
                onClick={fetchExercises}
                className="rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-zinc-500"
                >
                    Refresh
                </button>
            </header>

            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-4">

                    <form className="flex flex-col gap-4"> 
                        <div>
                            
                            <p className="text-sm font-medium text-zinc-300"> Add an exercise</p>
                            <p className="text-xs mt-1 text-zinc-500"> Save movements you want for future workouts</p>
                           
                            
                        </div> 

                        <input
                            className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500" 
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            placeholder="Insert exercise name"
                            type="text"
                            />

                            <button className="rounded-xl bg-green-500 py-2 text-sm font-semibold text-black transition hover:scale-[1.02] active:scale-95" type="button" onClick={handleAddExercise}> Add Exercises </button> 
                    </form>
              

            </section>

            { error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"> { error } </p>
            )}

            {/* <button onClick={fetchExercises}> Show Exercises </button>
            */}

            <section className="flex flex-1 flex-col gap-3 border rounded-2xl border-white/10 p-4"> 
                <div className="flex items-center justify-between"> 
                    <div>
                        <p className="text-sm font-semibold "> Exercise List</p>
                        <p className="text-xs text-zinc-500"> {exercises.length} saved </p>
                    </div> 
                  
                    <button
                    type="button"
                    onClick={closeExercises}
                    className="text-sm text-zinc-400 transition hover:text-white"
                    >
                        Clear
                    </button>
                </div>

                { loading && (
                    <p className="text-zinc-400 text-sm "> Loading exercises... </p>
                )}

                {!loading && exercises.length === 0 && (
                    <p className="text-zinc-400 text-sm"> No exercises yet</p>
                )}
                
          

            {!loading && exercises.length > 0 && (
            <div className="flex flex-col gap-2"> 
                
                { exercises.map((ex)=> 
                    <div className="flex items-center justify-between rounded-xl bg-zinc-950 px-3 py-3" key={ex.id}> 
                        <p className="text-sm font-medium"> {ex.name}</p>
                        <p className="text-xs text-zinc-500"> #{ex.id} </p>
                    </div>
                )}

             </div>
            )}
            </section>
            </div> 
        </main>
    )
}