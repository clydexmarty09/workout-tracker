"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";  

export default function Workouts() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const [workouts, setWorkouts] = useState<any[]>([]);
    const [exercises, setExercises] = useState<any[]>([]); 
    const [workoutName, setWorkoutName] = useState<string>(""); 
    const [selectedExercises, setSelectedExercises] = useState<any[]>([]); 
    
    const [label, setLabel]= useState(""); 

    const router = useRouter(); 
    
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

                router.push(`/main/session/${data.id}`); 
    
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
            setError(""); 

            await fetchWorkouts(); 

        } catch (error) {
            setError("Cannot add workout")
        } finally { 
            setLoading(false); 
        }
    }

    function toggleSelectedExercises(exercise: any) {
        
        setSelectedExercises((prev)=> {
            const exists = prev.some((item)=> item.id === exercise.id); 

            if(exists) {
                return prev.filter((item)=> item.id !== exercise.id); 
            }

            return [...prev, exercise]; 
        }); 
    }

    async function fetchExercises() {
        try {
            setLoading(true); 

            const res = await fetch(`/api/exercises`); 
            const data = await res.json(); 

            if(!res.ok) {
                setError(data.error || "Cannot fetch exercises"); 
            }

            setExercises(data); 
            setError(""); 
            console.log(data); 

        } catch {
            
            setError("Cannot fetch exercises");
            
            return ; 

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
                        className="border border-white/10 w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500" 
                        />


                        <input
                        value={label}
                        onChange={(e)=> setLabel(e.target.value)}
                        placeholder="Insert workout label (optional)"
                        type="text"
                        className="border border-white/10 w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500" 
                        />

                        <div className="flex flex-col gap-3"> 
                            <div className="flex items-center justify-between"> 
                                <div> 
                                    <p className="text-sm font-medium"> Choose exercises</p>
                                    <p className="text-xs text-zinc-500"> {selectedExercises.length} </p>
                                </div>

                                <button 
                                type="button"
                                onClick={fetchExercises}
                                className="rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-zinc-500"
                                >
                                    Load 
                                </button>
                            </div>

                            {exercises.length === 0 && (
                                <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-zinc-500"> Load exercises to choose from your library</p>
                            )}

                            {exercises.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {exercises.map((exercise)=> {
                                        const selected = selectedExercises.some(
                                            (item)=> item.id === exercise.id
                                        ); 

                                        return (
                                            <button
                                            key={exercise.id}
                                            type="button"
                                            onClick={()=> toggleSelectedExercises(exercise)}
                                            className = {
                                                selected 
                                                ? "rounded-full border border-green-500 bg-green-500 px-3 py-1.5 text-xs font-semibold text-black"
                                                : "rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300"
                                            }
                                            >
                                                {exercise.name}
                                            </button>
                                        ); 
                                    })}
                                </div>
                            )}
                        </div>

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
                            <p className="text-sm text-zinc-400"> Loading workouts... </p>
                        )}

                        {!loading && workouts.length === 0  &&(
                            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                                <p className="text-sm text-zinc-500"> No workouts yet. </p>
                            </div>
                        )}

                        {!loading && workouts.length > 0 && (
                            <div className="flex flex-col gap-3">
                                
                                    {workouts.map((w)=> 
                                        <div className="flex flex-col gap-3 border border-white/10 bg-black p-3 text-sm" key={w.id}> 
                                            <div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-sm font-semibold"> {w.name} </h3> 

                                                    {w.label && (
                                                         <p className="mt-1 text-xs text-zinc-500"> {w.label} </p>
                                                    )}
                                                   
                                                </div>
                                                    <p className="text-xs text-zinc-600>"> #{w.id} </p>
                                             </div>

                                             {w.created_at && (
                                                <p className="mt-2 text-xs text-zinc-600"> Created at: {w.created_at}</p>
                                             )}

                                             {w.exercises && w.exercises.length > 0 && (
                                                    
                                                    <div className="flex flex-wrap gap-2"> 

                                                        {w.exercises.map((e:any)=> 
                                                            <span
                                                            key={e.id}
                                                            className="rounded-full border-white/10 px-2 text-xs text-zinc-300"
                                                            >
                                                                {e.name}
                                                            </span>
                                                        )}
                                                    </div>

                                             )}

                                             {(!w.exercises || w.exercises.length === 0) && (
                                                <p className="text-xs text-zinc-600"> 
                                                No exercises attached
                                                </p>
                                             )}

                                             <div className="grid grid-cols-2 gap-2 "> 
                                              
                                                <button
                                                type="button"
                                                onClick={()=> handleAddSession(w.id)}
                                                className="rounded-xl bg-green-500 py-2 text-sm font-semibold text-black transition hover:scale-[1.02] active:scale-95"
                                                >
                                                    Start
                                                </button>

                                                <button
                                                type="button"
                                                onClick={()=> handleDeleteWorkout(w.id)}
                                                className="rounded-xl  bg-red-400 py-2 text-sm font-semibold text-black transition hover:scale-[1.02] active:scale-95"
                                                >
                                                    Delete
                                                </button> 

                                            </div>        
                                        </div> 
                                    )}
    
                            </div>
                        )}
                    </div>
                </section>
            </div> 
        </main>
    )
}