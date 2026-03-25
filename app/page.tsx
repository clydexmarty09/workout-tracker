import Link from "next/link"; 

export default function Home() {
  return (
    <div className="min-h-dvh bg-gray-300/60"> 
      <main className="flex justify-center items-center relative w-full flex-col min-h-dvh overflow-hidden max-w-sm mx-auto"> 

        <h1 className="text-center font-bold text-2xl"> WORKOUT TRACKER </h1>
        <p className="text-center text-xs text-gray-600 py-4"> Track your workouts, check your progress, and set goals. </p>
        
        <div className="w-full items-center absolute bottom-4 left-0 flex flex-col gap-4 px-3">
          <Link className="text-center text-sm w-full p-1 border rounded-md border-gray-700" href="register"> REGISTER </Link>
          <Link className="text-center text-sm w-full p-1 border rounded-md border-gray-700" href="sign-in"> SIGN IN</Link>
        </div> 
      </main>
    </div>
  );
}
