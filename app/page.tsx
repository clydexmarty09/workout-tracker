import Link from "next/link"; 

export default function Home() {
  return (
    <div className="min-h-dvh"> 
      <main className="flex justify-center items-center relative w-full flex-col min-h-dvh overflow-hidden max-w-sm mx-auto"> 

        <h1 className="text-center font-bold text-2xl"> WORKOUT TRACKER </h1>
        <p className="text-center text-xs text-gray-300 py-4"> Track your workouts, check your progress, and set goals. </p>
        
        <div className="w-full items-center absolute bottom-4 left-0 flex flex-col gap-4 py-3 px-3">
          <Link className="btn" href="/register"> REGISTER </Link>
          <Link className="btn" href="/login"> SIGN IN</Link>
        </div> 
      </main>
    </div>
  );
}
