"use client"; 
import { useCallback, useEffect, useState } from "react"; 
import { useParams } from "next/navigation";

// These types describe the data this page expects from the backend.
// They help TypeScript know which fields exist on exercises, sets, and sessions.
type SessionExercise = {
    id: number;
    name: string;
};

type SessionSets = {
    id: number;
    session_id: number; 
    exercise_id: number; 
    set_number: number; 
    weight_lbs: number; 
    reps: number; 
    created_at: string; 
}; 

type SetInputs = {

    [exerciseId: number]: {
        reps?:string, 
        weightLbs?:string; 
    }; 
}; 

type WorkoutSession = {
    session_id: number;
    workout_id: number;
    created_at: string;
    workout_name: string;
    workout_label: string | null;
    exercises: SessionExercise[];
};

// Main page for one active workout session.
// The [id] folder means this page is for a specific session from the URL.
export default function SessionId() {

    // Data fetched from the backend.
    const [session, setSession] = useState<WorkoutSession | null>(null)
    const [sets, setSets] = useState<SessionSets[]>([]); 

    // Page status and error message state.
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); 

    // Temporary form values for each exercise before they are saved.
    // Example: setInputs[3] stores reps/weight for exercise id 3.
    const [setInputs, setSetInputs] = useState<SetInputs>({})
    

    // Get the session id from the URL.
    // Example: /main/session/12 gives us id = "12".
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // Save a new set to the backend for this session.
    // This sends the exercise id, set number, reps, and weight.
    const addSets = async (exerciseId: number, setNumber: number) => {
        
        try {
            setLoading(true); 

            const res = await fetch(`/api/workout-sessions/${id}/sets`,
                {
                    method: "POST", 
                    headers: {
                        "Content-Type" : "application/json"
                    }, body: JSON.stringify({
                        exerciseId,
                        setNumber,
                        repNumber: Number(setInputs[exerciseId]?.reps), 
                        weightLbs: Number(setInputs[exerciseId]?.weightLbs)
                    }) 
                }
            )

            const data = await res.json(); 
            if(!res.ok) {
                setError(data.error || "Cannot update sets"); 
                return; 
            }

            await fetchSets(); 
        } catch {
            setError("Cannot update sets"); 
        } finally  {
            setLoading(false); 
        }
    }


    // Fetch all saved sets for this session from the backend.
    const fetchSets = async () => {

        try {
            setLoading(true); 
            const res = await fetch(`/api/workout-sessions/${id}/sets`); 
            const data = await res.json(); 

            if(!res.ok) {
                setError(data.error  || "Cannot fetch sets"); 
                return; 
            }

            setSets(data); 
            console.log(data); 
        } catch {
            setError("Cannot fetch sets"); 
        } finally {
            setLoading(false); 
        }
    }

    // Fetch the session details: workout name, label, and exercises.
    const fetchSession = useCallback(async () => {
        
        try {
            
            setLoading(true); 
            setError("");
            const res = await fetch(`/api/workout-sessions/${id}`); 
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Cannot fetch session");
                return;
            }
            
            setSession(data); 


        } catch {
            setError("Cannot fetch session"); 
            return; 

        } finally {
            setLoading(false); 
        }
    }, [id]);

    // When the page has a session id, load the session info and saved sets.
    useEffect(()=> {
        if (!id) return;

        fetchSets(); 
        fetchSession(); 
    }, [id, fetchSession])

    // Render the active workout page.
    return (
        <main className="min-h-dvh bg-black text-white"> 
            <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pb-28"> 
                {loading && <p className="text-sm text-zinc-400">Loading session...</p>}
                {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

                {session && (
                    <>
                        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-4"> 
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Active Session</p>
                            <h1 className="mt-1 text-xl font-bold">{session.workout_name}</h1>
                            {session.workout_label && (
                                <p className="mt-1 text-sm text-zinc-400">{session.workout_label}</p>
                            )}
                            <p className="mt-3 text-xs text-zinc-500">Session #{session.session_id}</p>

                  
                        </section>

                        <section className="rounded-2xl bg-zinc-950 p-4 border border-white/10"> 
                            <div className="mt-4 flex flex-col gap-2">
                                {session.exercises?.map((exercise) => {
                                    // For this exercise card, show only the sets that belong to this exercise.
                                    const exerciseSets = sets.filter((set) => set.exercise_id === exercise.id);

                                    return (
                                    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4" key={exercise.id}>
                                        <p className="text-sm font-medium">{exercise.name}</p>

                                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400"> 
                                                <p>Set</p>
                                                <p>Reps</p>
                                                <p>Weight</p>
                                            </div>
                                        
                                            <div className="mt-2 flex flex-col gap-2">
                                                {exerciseSets.map((set) => (
                                                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-black px-3 py-2 text-sm" key={set.id}> 
                                                        <p>{set.set_number}</p>
                                                        <p>{set.reps}</p>
                                                        <p>{set.weight_lbs} lbs</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2"> 
                                        
                                                <input
                                                value={setInputs[exercise.id]?.reps || ""}
                                                onChange={(e)=> 
                                                    setSetInputs((prev)=> ({
                                                        ...prev, 
                                                        [exercise.id]: {
                                                            ...prev[exercise.id], 
                                                            reps: e.target.value, 
                                                        }, 
                                                    }))
                                                }
                                                placeholder="Reps"
                                                className="rounded-xl bg-black px-3 py-2 text-sm text-white outline-none"
                                                />
                                                <input
                                                value={setInputs[exercise.id]?.weightLbs || ""}
                                                onChange={(e)=> 
                                                    setSetInputs((prev)=> ({
                                                        ...prev, 
                                                        [exercise.id] : {
                                                            ...prev[exercise.id], 
                                                            weightLbs: e.target.value,
                                                        }, 
                                                    }))
                                                }
                                                placeholder="Weight"
                                                />
                                            </div>
                                             <button type="button"
                                             onClick={()=> addSets(exercise.id, exerciseSets.length + 1)}
                                             className="mt-2 rounded-xl bg-green-500 py-2 px-1.5 text-sm font-semibold text-black"
                                             > 
                                                Add Sets
                                             </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                 </>
                )}
            </div>
        </main>
    )
}
