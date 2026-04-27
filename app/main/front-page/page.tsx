"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 

export default function FrontPage() {

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
     
    // for creating a session
    const [session, setSession] = useState<any | null>(null);
    
    // for tabbing the other sections of the site 
    
    // const [showExercises, setShowExercise] = useState(false);
    // const [showWorkouts, setShowWorkouts] = useState(false); 

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
    async function handleLogout() {
        try {

            setError(""); 
            setLoading(true); 

            const res = await fetch(`/api/auth/logout`, 
                {
                    method: "POST"
                }
            ); 

            if (!res.ok) {
                setError("Log out failed")
                return; 
            }

            router.push('/login'); 

        } catch {
            setError("Unauthorized"); 
        } finally {
            setLoading(false); 
        }
    }
   

    // this function gets all exercises from the backend and stores them in state 
    // this is for creating a temporary workout 
    // function addToWorkout(exercise: any) {
    //     // we use prev because it's the value of the state before any updates 
    //      setSelectedExercises((prev)=> {
    //         const exists = prev.some((item)=> item.id === exercise.id); 
 
    //         if(exists) {
    //             return prev; 
    //         }

    //         return [...prev, exercise]; 
    //      }); 
    
    // }

    // function deleteExercises(id: number) {
    //     // filter because we create a new array only passing the given condition 
    //     setSelectedExercises((prev)=> 
    //         prev.filter((item)=> item.id !== id)
    //     ); 
    // }

    return (

        <main className="min-h-dvh bg-black text-white">

            <div className="mx-auto flex max-w-md flex-col gap-4 p-4">

            <header className="header">
                <div className="flex items-center justify-between px-4 py-4">
                    <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Dashboard</p>
                    <h1 className="text-xl font-bold">Workout Tracker</h1>
                    </div>

                    <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300"
                    >
                    Exit
                    </button>
                </div>
            </header>

            {/* <section className="px-4 py-4"> 

                <div className="summary-card"> 
                    <p className="text-sm font-medium opacity-80"> Welcome back </p>
                    <h2 className="mt-1 text-2xl font-bold"> Ready to train? </h2>
                    
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center"> 
                        <div className="welcome-section-cols"> 
                            <p> {exercises.length} </p>
                            <p> Exercises </p>
                        </div> 
                            
                        <div className="welcome-section-cols"> 
                            <p> {workouts.length} </p>
                            <p> Workouts </p>

                        </div>
                           
                        <div className="welcome-section-cols"> 
                            <p> {session ? "1" : "0"} </p>
                            <p> Active </p>
                        </div> 
                    </div> 
                </div> 
            </section> */}
    
        
            <section className="p-3">
                <div className="card"> 
                    <button className="my-2" type="button" onClick={()=> {
                        setShowExercise(prev=>!prev); 
                        fetchExercises(); 
                    }}>

                    <h3 className="underline text-lg font-semibold text-left"> {showExercises? "Hide": "Show Exercises"} </h3>
                     </button> 

                  
                
                    { showExercises && (
                    <>
                        { loading && <p> Loading ... </p>}
                        { error && <p className="text-red-500"> { error} </p>}
                        <h2 className="text-md"> Exercise List </h2>
                        { exercises.map((e)=> (
                            <div className="flex gap-3" key={e.id}> 
                                <p className="flex-1"> {e.name} </p>
                                <button className="btn-3" type="button" onClick={()=>  addToWorkout(e)}> [Add] </button>
                            </div> 
                        ))}
                    
                    
                        <button type="button" className="btn-2 w-full" onClick={closeExercises}> Close </button>
                  </>
                  )}
                    
                </div>

                </section>

                <section className="p-3">

                   <div className="card">
                    <button type="button" onClick={()=> {
                        setShowWorkouts(prev=>!prev); 
                        fetchWorkouts(); 
                    }}> 
                    
                        <h3 className="text-left underline text-lg font-semibold"> {showWorkouts ? "Hide": "Show Workouts"} </h3>
                    </button>

                    { showWorkouts && 
                        <div className="flex flex-col gap-4"> 
                            <h2 className="font-semibold text-2xl"> Current Workout </h2>
                            { selectedExercises.map((exercise)=> (
                                <div className="flex gap-3" key={exercise.id}> 
                                    <p className="flex-1"> { exercise.name} </p>
                                    <button className="btn-3 "type="button" onClick={()=> deleteExercises(exercise.id)}> [Delete] </button>
                                </div> 
                            ))}
                            

                            <input
                            value={workoutName}
                            onChange={(e)=> setWorkoutName(e.target.value)}
                            placeholder="Workout Name"
                            type="text"
                            className="border border-amber-50 rounded-md p-2 w-full"
                            /> 

                            <input
                            value={label}
                            onChange={(e)=> setLabel(e.target.value)}
                            placeholder="Workout Label (optional)"
                            type="text"
                            className="border border-amber-50 rounded-md p-2 w-full"
                            />

                            <button className="btn" type="button" onClick={handleCreateWorkout}> Create Workout </button>
                        </div>

                    }

                    </div>
            </section>


            <div className="card">  
                <h2 className="text-left text-2xl font-semibold"> Workouts </h2>
                { workouts.map((w)=> (
                    <div className="flex text-left flex-col gap-3" key={w.id}> 
                        <h3> {w.name} </h3>
                        <p> {w.label} </p>
                        <button className="btn-3" onClick={()=> handleAddSession(w.id)}> Start Workout </button>
                        <button onClick={()=> handleDeleteWorkout(w.id)}type="button" className="btn-2"> Delete </button> 

                        {w.exercises.map((exercise: any)=> (
                            <div key={exercise.id}> {exercise.name} </div> 
                        ))}
                    </div>
                ))}
            </div>

            <div className="exercises-card">

                { !session ?  (<p> No sessions yet </p>) : (

                    <div> 
                        <h3> Active Session: </h3>
                        <p> Wokout ID: {session.workout_id}  </p>
                        <p> Started at: {session.created_at} </p>

                    </div>
                
                )}
            </div>

            </div>
       
        </main>
    )
}