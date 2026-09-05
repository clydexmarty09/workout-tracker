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
            
            <div className="flex flex-col max-w-md mx-auto"> 

                {isLoading && (<p> Loading data... </p>) }
                {error && ( <p> {error}  </p>)}

                <section> 
                    {Object.entries(progressBySession).map(([sessionId, sessionSets]) => {

                        const firstSet = sessionSets[0]; 

                        return (
                            <div key={sessionId}>

                                <p> {new Date(firstSet.completed_at).toLocaleDateString()} </p>
                                <p> {firstSet.workout_name} </p>

                                <details> 
                                    <summary> View Exercises </summary>

                                    {sessionSets.map((set)=> (
                                        <div key={set.set_id}>
                                            <p> {set.exercise_name} </p>
                                            <p> {set.weight_lbs} kg x {set.reps} </p>
                                        </div>
                                    ))}
                                </details>
                            </div>
                        ); 
                    })}
                </section>


            </div>

        </main>
    )


}