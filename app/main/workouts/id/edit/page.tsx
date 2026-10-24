export default async function editworkoutPage({ params } : { params : Promise<{ id:string }>;}) {

    const { id }  = await params; 

    return(
        <div> 
            <h1> Edit workout</h1>
            <p> Workout ID : {id} </p>
        </div>
    )
}