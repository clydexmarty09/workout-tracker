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

    // this function gets all exercises from the backend and stores them in state 
    async function fetchExercises() {
        try {

            setLoading(true);  // because fetching takes time 
            const res = await fetch(`/api/exercises`); 
            const data = await res.json(); 
            
            if (!res.ok) {
                setError("Cannot fetch exercises ")
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
             <button className="underline text-blue-300 text-left font-semibold p-3" type="button" onClick={handleLogout}> EXIT </button>
    
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
               
                 
                { loading && <p> Loading ... </p>}
                { error && <p> { error} </p>}
                { exercises.map((e)=> (
                    <div className="flex gap-3" key={e.id}> 
                        <p className="flex-1"> {e.name} </p>
                        <button className="btn-3" type="button" onClick={()=>  addToWorkout(e)}> [Add] </button>
                    </div> 
                ))}

             
                {/* <button className="btn-2 w-55" onClick={closeExercises}> Close </button> */}
                
            </div>

            <div> 
                <h2> Current Workout </h2>
                { selectedExercises.map((exercise)=> (
                    <div key={exercise.id}> 
                        <p> { exercise.name} </p>
                        <button type="button" onClick={()=> deleteExercises(exercise.id)}> </button>
                    </div> 
                ))}
            </div>
       
        </div> 
       
        </main>
    )
}