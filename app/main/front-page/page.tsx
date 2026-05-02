"use client"; 
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 

export default function FrontPage() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const [exerciseCount, setExerciseCount] = useState(0); 
    const [workoutCount, setWorkoutCount] = useState(0); 
    const [sessionCount, setSessionCount] = useState(0); 
    const [activeSession, setActiveSession] = useState<any | null>(null); 


    useEffect(()=> {
        async function fetchData() {
            const exerciseRes = await fetch("../api/exercises");   // get response object 
            const workoutRes = await fetch("../api/workouts"); 
            const sessionRes = await fetch("../api/workout-sessions"); 

            const exercises = await exerciseRes.json();  // convert response object into readable JS 
            const workouts = await workoutRes.json(); 
            const sessions = await sessionRes.json(); 

            setExerciseCount(exercises.length); 
            setWorkoutCount(workouts.length); 
            setSessionCount(sessions.length); 

            setActiveSession(sessions[0]); 
        }

        fetchData(); 
    }, [])
   

    // async function fetchsessions() {
    //     try {
    //         setLoading(true); 
    //         const res = await fetch(`/api/workout-sessions`); 
    //         const data = await res.json(); 

    //         if(!res.ok) {
    //             setError("Cannot fetch sessions")
    //         }

    //         setError(""); 
    //         setSession(data); 

    //     } catch {
    //         setError("Cannot fetch sessions"); 
    //     } finally {
    //         setLoading(false); 
    //     }
    // }

    const router = useRouter(); // for navigation

    return (

        <main className="bg-black text-white min-h-screen">

            <div className="min-h-screen mx-auto flex flex-col max-w-md gap-4 p-4">

            <header className="header">
                <div className="flex items-center justify-between px-4 py-4">
                    <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Dashboard</p>
                    <h1 className="text-xl font-bold">Workout Tracker</h1>
                    </div>

                </div>
            </header>

            <section className="px-2"> 

                <div className="summary-card"> 
                    <p className="text-sm font-medium opacity-80"> Welcome back </p>
                    <h2 className="mt-1 text-2xl font-bold"> Ready to train? </h2>
                    
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center"> 
                        <div className="welcome-section-cols"> 
                            <p> {exerciseCount} </p>
                            <p> Exercises </p>
                        </div> 
                            
                        <div className="welcome-section-cols"> 
                            <p> {workoutCount} </p>
                            <p> Workouts </p>

                        </div>
                           
                        <div className="welcome-section-cols"> 
                            <p> {sessionCount ? "1" : "0"} </p>
                            <p> Active </p>
                        </div> 
                    </div> 
                </div> 
            </section>

            <div className="items-left flex flex-col p-4 my-2 gap-3 border rounded-md border-white/10">

                { !activeSession ?  (<p className="font-semibold text-left"> No sessions yet </p>) : (

                    <div> 
                        <h3 className="font-bold text-lg my-2"> Active Session: </h3>
                        <p className="font-semibold text-sm"> Wokout ID: <span className="font-normal"> {activeSession?.workout_id} </span> </p>
                        <p className="font-semibold text-sm"> Started at: <span className="font-normal"> {activeSession?.created_at} </span> </p>

                    </div>
                
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm"> 
                
                <div className="rounded-xl bg-black-40 p-3">
                    <p className="text-zinc-400"> Status</p>
                    <p className="font-semibold text-green-400"> In progress</p>
                </div>
                
                <div className="rounded-xl bg-black-40 p-3"> 
                    <p className="text-zinc-400"> Session Id:</p>
                    <p className="font-semibold text-green-400"> {activeSession?.id} </p>
                </div>

               

            </div>
             <div className="flex justify-between">
                    <button type="button" className="text-sm w-50 transition hover:scale-105 active:scale-95 rounded-xl bg-green-500 py-2 font-semibold text-black"> 
                        Resume Workout
                    </button>
                    
                    <button type="button" className="text-sm w-50 transition hover:scale-105 active:scale-95 rounded-xl bg-red-400 py-2 font-semibold text-black"> 
                        Stop Workout
                    </button>
                     
                </div>
            </div>
       
        </main>
    )
}