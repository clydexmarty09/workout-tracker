"use client"; 
import { useEffect, useState } from "react";

export default function Progress() {

    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(""); 
    const [progress, setProgress] = useState<any[]>([])

    
    
    const fetchProgress = async() => {
        try {

            setIsLoading(true); 
            setError("")

            const res = await fetch(`/api/progress`); 
            const data = await res.json()

            if(!res.ok) {
                setError(data.error || "Cannot retrieve data"); 

                return ; 
            }

            setProgress(data) ; 

        } catch {

            setError("Cannot retrieve data") ; 

        } finally {

            setIsLoading(false); 
        }   
    }

    useEffect(()=> {
        fetchProgress(); 
    }, [])

    const progressBySession : Record<string, any[]> = {} ; 

    for (const item of progress) {
        if (!progressBySession[item.session_id]) {  // check bucket for this session ID
            progressBySession[item.session_id] = [] ;  // create new empty arrat for session
        }

        progressBySession[item.session_id].push(item) ;  // push the correct items with the corresponding session ID
    }

    console.log(progressBySession) ; 

    return (
     
        <main className="min-h-dvh">
            
            <div className="flex flex-col gap-4 p-4 max-w-md mx-auto pb-28"> 

                 <h1 className="text-xl font-bold"> Workout History </h1> 

                {isLoading && (<p className="text-sm text-zinc-200"> Loading data... </p>) }
                {error && ( <p className="text-red-400 text-sm"> {error}  </p>)}

              
                {!isLoading && !error && progress.length === 0 && (
                    <p className="text-sm text-zinc-400"> No data to display. </p>
                )}

                <section className="flex flex-col gap-4"> 
                    {Object.entries(progressBySession).map(([sessionId, sessionSets]) => {

                        const firstSet = sessionSets[0]; 

                        return (
                            <div className="border bg-zinc-950 border-white/10 rounded-2xl p-4" key={sessionId}>

                                <p className="font-semibold text-md"> {firstSet.workout_name} </p> 
                                <p className="text-sm text-zinc-200"> {new Date(firstSet.completed_at).toLocaleDateString("en-PH")}{" "} {new Date(firstSet.completed_at).toLocaleDateString("en-PH", {
                                    weekday: "long" , 
                                })} </p>


                                <details> 
                                    <summary> View Exercises </summary>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {sessionSets.map((set)=> (
                                            <div key={set.set_id}>
                                                <h3 className="flex items-center gap-2">
                                                    <span className="italic text-sm"> {set.exercise_name} </span>
                                                    <span className="text-xs text-zinc-100"> {set.weight_lbs} kg x {set.reps} reps </span>
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        ); 
                    })}
                </section>


            </div>

        </main>
    )


}