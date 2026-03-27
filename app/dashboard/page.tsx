"use client"; 
import { useState } from "react"; 

export default function DashBoard() {

    const [showAddWorkout, setShowAddWorkout] = useState(false); 
    const [workoutName, setWorkoutName] = useState(""); 
    const [workoutLabel, setWorkoutLabel] = useState("");

    return(
        <div> 
            <main> 
                <div> 
                    {!showAddWorkout ? (
                        <button> Add Workout </button>
                    ) : (
                        <div> 
                            <h2> Create workout </h2>
                            
                            <input
                            value={workoutName}
                            type="text"
                            placeholder="Workout Name"
                            onChange={(e)=> setWorkoutName(e.target.value)}
                            />

                            <input
                             value={workoutLabel}
                             type="text"
                             placeholder="Label (optional)"
                             onChange={(e)=> setWorkoutLabel(e.target.value)}
                             />

                             <div> 
                                <button> Cancel </button>
                                <button> Continue </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}