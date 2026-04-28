import BottomNav from "@/app/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-black text-white">
     
        {children}
      
      <BottomNav />
    </main>
  );
}