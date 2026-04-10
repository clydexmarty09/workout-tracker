"use client"; 
import { useState } from "react"; 

// we need this because the results are objects 
type Exercise = {
    id: number; 
    name: string; 
}

type Workout = {
    id: number; 
    name: string; 
    label: string | null; 
    exercises: Exercise[]; 
}

export default function DashBoard() {

    const [showAddWorkout, setShowAddWorkout] = useState(false); 
    const [workoutName, setWorkoutName] = useState(""); 
    const [workoutLabel, setWorkoutLabel] = useState("");
    const [exerciseSearch, setExerciseSearch] = useState("") // stores whatever the user types in the search box 
    const [exerciseResults, setExerciseResults] = useState<Exercise[]>([]);  // stores the matches the come back from API route
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])  // stores the exercises the user picked for workout
    const [workouts, setWorkouts] = useState<Workout[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 
    const [hasFetched, setHasFetched] = useState(false);  

    // for updating the workout
    const [editingWorkoutId, setEditingWorkoutId] = useState<number | null>(null); 
    const [editWorkoutName, setEditWorkoutName] = useState(""); 
    const [editWorkoutLabel, setEditWorkoutLabel] = useState(""); 

    // for adding an exercise to a workout
    const [addExerciseId, setAddExerciseId] = useState<number | null>(null);
    
    async function handleLogout() {
      try {

        const response = await fetch(`/api/auth/logout`, 
          { method: "POST" }
        ); 

        const data = await response.json(); 
        if(!response.ok) {
          setError(data.error || "Logout Failed"); 
          return; 
        }

        window.location.href = "/login"; 

      } catch (error) {
        console.error("Somethign went wrong")
        setError("Logout Failed")
      }
    }

    async function deleteExercise(id: number, exerciseId: number) {
        try {
            setError(""); 
            const response = await fetch(
                `/api/workouts/${id}/exercises/${exerciseId}`, 
                {
                    method: "DELETE", 
                }
            ); 

            const data = await response.json(); 
            if (!response.ok) {
                setError(data.error || "Failed to remove exercise"); 
                return; 
            }

            setWorkouts((prev) =>
                prev.map((workout) => 
                    workout.id === Number(id)
                    ? { 
                        ... workout, 
                        exercises: workout.exercises.filter(
                            (exercise) => exercise.id !== Number(exerciseId)
                        )
                     }
                     : workout 
                )
            ); 
        } catch (error) {
            console.error(error); 
            setError("Something went wrong"); 
        }
    }
    async function handleEditWorkout(id: number) {
        setError(""); 

        try {

            const res = await fetch(`/api/workouts/${id}`, 
            {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify({
                    name: editWorkoutName, label: editWorkoutLabel
                }),
            }); 

            const data = await res.json(); 

            if(!res.ok) {
                setError(data.error || "Failed to update"); 
                return; 
            }

            setEditWorkoutLabel(""); 
            setWorkoutName(""); 
            setEditingWorkoutId(null); 
            await fetchWorkouts(); 

        } catch {
            setError("Update failed")
        }
    }
    // Frontend -> API -> DB -> API -> frontend 
    async function handleExerciseSearch() {
        
        setError(""); 
        try {
            // make a request to URL and encode it to prevent broken URLS 
            const res = await fetch(`/api/exercises?search=${encodeURIComponent(exerciseSearch)}`); 

            const data = await res.json(); 
            if(!res.ok) {
                //console.error(data.error || "Search failed"); 
                setError(data.error || "Search failed"); 
            }

            setExerciseResults(data)
        
        } catch (error) {
            setError("Search failed"); 
        }
    }

    // displays the workouts saved. 
    async function fetchWorkouts() {
        setLoading(true); 
        setError(""); 
        try {

            const res = await fetch("/api/workouts"); 
            const data = await res.json();
            console.log(data)
           

            if(!res.ok) {
                setError(data.error || "Failed to fetch workouts");
                return;  
            }
            
            setWorkouts(data); 
            setHasFetched(true); 

        } catch (error) {
            //console.error("Failed to fetch workouts", error)
            setError("Failed to fetch workouts"); 
        } finally {
            setLoading(false); 
        }
    }

    async function handleDeleteWorkout(id: number) {

        setError(""); 

        try {   
            const res = await fetch(`/api/workouts/${id}`, 
                { method: "DELETE", }
            ); 

            if (!res.ok) {
                throw new Error("Cannot delete data"); 
            }

            await fetchWorkouts(); 

        } catch {
            setError("Cannot delete data")
        }
    }   
    async function handleSaveWorkout() {
        try {   
            const res = await fetch("/api/workouts", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: workoutName, label:workoutLabel, 
                    exerciseIds: selectedExercises.map((exercise)=> exercise.id), 
                 }), 
            }); 

            const data = await res.json(); 
            
            if(!res.ok) {
                setError(data.error || "Failed to save workout")
                return null; 
            }

            await fetchWorkouts();  // get the newest workouts from the server after POST success 

            //success : close the form and clear inputs 
            setShowAddWorkout(false); 
            setWorkoutName(""); 
            setWorkoutLabel(""); 
            setExerciseSearch(""); 
            setExerciseResults([]); 
            setSelectedExercises([]); 


        } catch (error) {
            console.error("Failed to save workout", error); 
        }
    }

    async function handleAddExercisesToWorkout(exercise: Exercise, workout: Workout) {
      try {

        const res = await fetch(`/api/workouts/${workout.id}/exercises`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          }, 
          body: JSON.stringify( { exerciseId: exercise.id}), 

        });

        const data = await res.json(); 
        if(!res.ok) {
          setError(data.error || "Cannot add exercise"); 
          return; 
        }

        await fetchWorkouts();
        setExerciseSearch(""); 
        setExerciseResults([]); 
        setAddExerciseId(null); 
         

      } catch {
        setError("Cannot add exercise"); 
      }
    }

    function handleAddExercise(exercise: Exercise) {
        
        setSelectedExercises((prev)=> {
            const exists = prev.some((item)=> item.id === exercise.id);  // check for duplicates 

            if(exists) {
                return prev; 
            }

            return [...prev, exercise]; 
        }); 
    }

    function handleRemove(id: number) {
        setSelectedExercises((prev) => 
         prev.filter((exercise) => exercise.id !== id)  // only keep the exercises whose id does not match the one we want to remove 
     ); 
    }

    return (
  <div>
    <main>
      <div>
        
        <button onClick={handleLogout}> Logout </button>
        {/* Add workout section */}
        {!showAddWorkout ? (
          <button onClick={() => setShowAddWorkout(true)}>Add Workout</button>
        ) : (
          <div>
            <h2>Create workout</h2>

            <input
              value={workoutName}
              type="text"
              placeholder="Workout Name"
              onChange={(e) => setWorkoutName(e.target.value)}
            />

            <input
              value={workoutLabel}
              type="text"
              placeholder="Label (optional)"
              onChange={(e) => setWorkoutLabel(e.target.value)}
            />

            <div>
              <input
                value={exerciseSearch}
                type="text"
                placeholder="Search Exercise"
                onChange={(e) => setExerciseSearch(e.target.value)}
              />

              <button type="button" onClick={handleExerciseSearch}>
                Search
              </button>
            </div>

            <div>
              <h3>Search Results</h3>
              {exerciseResults.map((exercise) => (
                <div key={exercise.id}>
                  <p>{exercise.name}</p>
                  <button
                    type="button"
                    onClick={() => handleAddExercise(exercise)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>

            <div>
              <h3>Selected Exercises</h3>
              {selectedExercises.map((exercise) => (
                <div key={exercise.id}>
                  <p>{exercise.name}</p>

                  <button
                    onClick={() => handleRemove(exercise.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={() => {
                  setShowAddWorkout(false);
                  setWorkoutName("");
                  setWorkoutLabel("");
                  setExerciseSearch("");
                  setExerciseResults([]);
                  setSelectedExercises([]);
                }}
              >
                Cancel
              </button>

              <button type="button" onClick={handleSaveWorkout}>
                Save Workout
              </button>
            </div>
          </div>
        )}

        {/* Show workouts section */}
        <div>
          <button type="button" onClick={fetchWorkouts}>
            Show Workouts
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : !hasFetched ? null : workouts.length === 0 ? (
            <p>No workouts yet</p>
          ) : (
            workouts.map((w) => (
              <div key={w.id}>
                {editingWorkoutId === w.id ? (
                  <div>
                    <input
                      value={editWorkoutName}
                      onChange={(e) => setEditWorkoutName(e.target.value)}
                      type="text"
                      placeholder="Workout Name"
                    />

                    <input
                      value={editWorkoutLabel}
                      onChange={(e) => setEditWorkoutLabel(e.target.value)}
                      type="text"
                      placeholder="Workout Label"
                    />

                    <button
                      type="button"
                      onClick={() => handleEditWorkout(w.id)}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditWorkoutName("");
                        setEditWorkoutLabel("");
                        setEditingWorkoutId(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2>{w.name}</h2>
                    <p>{w.label}</p>

                    <button
                      type="button"
                      onClick={() => {
                        setEditWorkoutLabel(w.label || "");
                        setEditWorkoutName(w.name);
                        setEditingWorkoutId(w.id);
                      }}
                    >
                      EDIT WORKOUT
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteWorkout(w.id);
                      }}
                    >
                      DELETE WORKOUT
                    </button>

                    <button
                    type="button"
                    onClick={()=> setAddExerciseId(w.id)}
                    > Add Exercise </button>

                    {addExerciseId === w.id ? (
                        <div> 
                            <div> 
                                <input
                                value={exerciseSearch}
                                placeholder="Search Exercise"
                                onChange={(e)=> setExerciseSearch(e.target.value)}
                                type="text"
                                />

                                <button onClick={handleExerciseSearch}> Search </button>
                            </div>

                        <div>
                            <h3>Search Results</h3>
                            {exerciseResults.map((exercise) => (
                                <div key={exercise.id}>
                                <p>{exercise.name}</p>
                                <button
                                    type="button"
                                    onClick={() => handleAddExercise(exercise)}
                                >
                                    Add
                                </button>
                                </div>
                            ))}
                        </div> 
                           
                            <button
                            type="button"
                            onClick={()=> setAddExerciseId(null)}
                            > 
                            Cancel
                            </button>
                        </div> 
                    ): null }

                    {w.exercises?.map((ex) => (
                    <div key={ex.id}> 
                      <p key={ex.id}>- {ex.name}</p>
                      <button type="button" onClick={()=> deleteExercise(w.id, ex.id)}> DELETE</button>
                    </div> 
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  </div>
)};
