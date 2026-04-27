"use client"; 
import { useEffect, useState } from "react"; 

export default function Dashboard() {

    const [exerciseCount, setExerciseCount] = useState(0); 
    const [workoutCount, setWorkoutCount] = useState(0); 

    useEffect(()=> {

        async function fetchDashboard() {
            const exerciseRes = await fetch("../api/exercises"); 
            const workoutRes = await fetch("../api/workouts"); 

            const exercises = await exerciseRes.json(); 
            const workouts = await workoutRes.json(); 

            setExerciseCount(exercises.length); 
            setWorkoutCount(workouts.length);
        }

        fetchDashboard(); 
    },[])

    return
}