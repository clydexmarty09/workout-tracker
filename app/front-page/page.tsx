"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 

export default function FrontPage() {

    const [exerciseName, setExerciseName] = useState(""); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [exercises, setExercises] = useState<any[]> ([]); 

    // for creating workouts 
    const [selectedExercises, setSelectedExercises] = useState<any[]>([]); 
    const [workoutName, setWorkoutName] = useState<string>(""); 
    const [label, setLabel]= useState(""); 
    const [workouts, setWorkouts] = useState<any[]>([]);
    
    // for creating a session
    const [session, setSession] = useState<any | null>(null); 

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
            const res = await fetch(`/api/exercises`,  // send request to backend route 
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

    // this function gets all exercises from the backend and stores them in state 
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

    // this is for creating a temporary workout 
    function addToWorkout(exercise: any) {
        // we use prev because it's the value of the state before any updates 
         setSelectedExercises((prev)=> {
            const exists = prev.some((item)=> item.id === exercise.id); 
 
            if(exists) {
                return prev; 
            }

            return [...prev, exercise]; 
         }); 
    
    
    }

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

    function deleteExercises(id: number) {
        // filter because we create a new array only passing the given condition 
        setSelectedExercises((prev)=> 
            prev.filter((item)=> item.id !== id)
        ); 
    }

    function closeExercises() {
        setExercises([]); 
    }

    return (

        <main className="bg-black">
            {/* <div className="flex justify-between p-3"> 
                <h1 className="font-semibold text-2xl"> WORKOUT TRACKER </h1>
                <button className="underline text-blue-300 text-right font-semibold p-3" type="button" onClick={handleLogout}> EXIT </button>
            </div>  */}

            <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
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
    
        <div className="main-page"> 
            
            <h1 className="text-left text-2xl font-bold"> Add an exercise </h1>
            
            <form className="flex flex-col gap-5"> 
                <input
                className="border border-amber-50 rounded-md p-1 w-full" 
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Insert exercise name"
                type="text"
                />

                <button className="btn w-full" type="button" onClick={handleAddExercise}> Add Exercises </button> 
            </form>

            <button className="btn w-full" type="button" onClick={fetchExercises}> Show exercises</button>
        
            <div className="exercises-card"> 
                <h2 className="font-semibold text-2xl"> Exercise List </h2>
               
                 
                { loading && <p> Loading ... </p>}
                { error && <p className="text-red-500"> { error} </p>}
                { exercises.map((e)=> (
                    <div className="flex gap-3" key={e.id}> 
                        <p className="flex-1"> {e.name} </p>
                        <button className="btn-3" type="button" onClick={()=>  addToWorkout(e)}> [Add] </button>
                    </div> 
                ))}

             
                {/* <button className="btn-2 w-55" onClick={closeExercises}> Close </button> */}
                
            </div>

            <button className="btn w-full" type="button" onClick={fetchWorkouts}> Show Workouts</button>

            <div className="exercises-card"> 
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


            <div className="exercises-card">  
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