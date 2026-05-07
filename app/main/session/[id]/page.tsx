"use client"; 
import { useCallback, useEffect, useState } from "react"; 
import { useParams } from "next/navigation";

type SessionExercise = {
    id: number;
    name: string;
};

type WorkoutSession = {
    session_id: number;
    workout_id: number;
    created_at: string;
    workout_name: string;
    workout_label: string | null;
    exercises: SessionExercise[];
};

export default function SessionId() {

    const [session, setSession] = useState<WorkoutSession | null>(null)
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); 

    const [sets, setSets] = useState<any[]>([]); 
    const [setInputs, setSetInputs] = useState({})
    


    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // const addSets = async () => {
        
    //     try {
    //         setLoading(true); 

    //         const res = await fetch(`/api/workout-sessions/${id}/sets`,
    //             {
    //                 method: "POST", 
    //                 headers: {
    //                     "Content-Type" : "application/json"
    //                 }, body: JSON.stringify() 
    //             }
    //         )
    //     } catch {
    //         setError("Cannot update sets"); 
    //     } finally  {
    //         setLoading(false); 
    //     }
    // }


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

    useEffect(()=> {
        if (!id) return;

        fetchSets(); 
        fetchSession(); 
    }, [id, fetchSession])

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
                                {session.exercises?.map((exercise) => (
                                    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4" key={exercise.id}>
                                        <p className="text-sm font-medium">{exercise.name}</p>
                                        {/* <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400"> 
                                            <p> Set</p>
                                            <p> Reps </p>
                                            <p> Weight</p>
                                        </div> */}
                                           
                                        
                                        <div>
                                        {exerciseSets.map((set)=> 
                                            <div key={set.id}> 
                                                <p> {set.set_number} sets </p>
                                                <p> {set.weight_lbs} lbs </p>
                                                <p> {set.reps} reps  </p>
                                            </div>
                                        )}
                                        </div>
                                    
                                    </div>
                                ))}
                            </div>
                        </section>
                 </>
                )}
            </div>
        </main>
    )
}
