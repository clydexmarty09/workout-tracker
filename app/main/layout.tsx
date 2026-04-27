import BottomNav from "@/app/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-blue-950 text-white">
      <div className="mx-auto max-w-md pb-24">
        {children}
      </div>

      <BottomNav />
    </main>
  );
}