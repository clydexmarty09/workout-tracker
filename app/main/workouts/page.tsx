"use client"; 
import { useState } from "react"; 

export default function Exercises() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const [workouts, setWorkouts] = useState<any[]>([]);
    const [workoutName, setWorkoutName] = useState<string>(""); 
    const [selectedExercises, setSelectedExercises] = useState<any[]>([]); 
    const [label, setLabel]= useState(""); 
    
    // for creating a session
    const [session, setSession] = useState<any | null>(null);

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

    async function handleAddSession(workoutId: number) {
            try {
                setLoading(true); 
                const res = await fetch(`/api/workout-sessions`, {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    body: JSON.stringify({ workoutId })
                }); 
    
                const data = await res.json(); 
               
                if(!res.ok) {
                    setError("Cannot create session") ; 
                    return;  
                }
    
                console.log(data); 
                setError(""); 
                setSession(data); 
    
            } catch {
                setError("Cannot create session"); 
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

            <div className="flex flex-col gap-4 pb-28 p-4 mx-auto max-w-md">
                <header className="flex justify-between p-2 items-center"> 
                    <div> 
                        <p className="text-xs text-zinc-400 uppercase tracking-[0.2em]"> Library </p>
                        <h1 className="font-bold text-xl"> Workouts </h1>
                    </div>

                    <button
                    onClick={fetchWorkouts}
                    className="border rounded-full px-3 py-1.5 border-zinc-700 text-center text-sm transition hover:border-zinc-500"    
                    > 
                    Refresh
                    </button>
                </header>

                <section className="border rounded-2xl p-2 border-white/10 bg-zinc-950"> 

                    <div className="flex flex-col gap-3"> 
                        <h1 className="text-sm"> Add a workout</h1>
                        <p className="text-xs text-zinc-500 "> Save and add workouts for future use. </p>

                        <input
                        value={workoutName}
                        onChange={(e)=> setWorkoutName(e.target.value)}
                        placeholder="Insert workout name"
                        type="text"
                        required
                        className="border w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500" 
                        />


                        <input
                        value={label}
                        onChange={(e)=> setLabel(e.target.value)}
                        placeholder="Insert workout label (optional)"
                        type="text"
                        className="border w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500" 
                        />

                        <button
                        type="button"
                        onClick={handleCreateWorkout}
                        className="rounded-xl bg-green-500 py-2 text-sm font-semibold text-black active:scale-95 transition hover:scale-[1.02]"
                        > Create workout </button>
                        
                    </div>


                </section>

                <section className="flex flex-col border gap-4 rounded-2xl p-4 border-white/10 bg-zinc-950"> 
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-sm font-semibold"> Workouts </h1>
                            <p className="text-xs text-zinc-500"> View and start saved workouts </p>
                        </div>
                        <p className="text-sm text-zinc-500"> {workouts.length} saved</p>
                    </div>

                    <div>

                        {loading && (
                            <p className="text-sm text-zinc-400"> Loading... </p>
                        )}

                        {!loading && workouts.length === 0  &&(
                            <p className="text-sm text-zinc-400"> No workouts yet. </p>
                        )}

                        {!loading && workouts.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <div> 
                                    {workouts.map((w)=> 
                                        <div className="flex flex-col gap-4 text-sm" key={w.id}> 
                                        
                                        <p> Name: <span> {w.name} </span> </p> 
                                        <p> Label: <span> {w.label} </span></p>
                                        <p> Created: <span> {w.created_at} </span></p>

                                        {w.exercises.map((e: any)=> 
                                            <div key={e.id}> {e.name} </div>
                                        )}
                                        
                                        </div> 
                                    )}
                                </div> 
                            </div>
                        )}
                    
                    </div>
                </section>
            </div> 
        </main>
    )
}