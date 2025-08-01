import { StudentDashboardSidebar } from "@/components/dashboard/student-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // IMPROVEMENT: Applied the new custom gradient class.
    <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8 background-gradient-custom">
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-card/90 p-6 shadow-xl backdrop-blur-lg lg:p-8 flex flex-col lg:flex-row gap-8">
        <StudentDashboardSidebar />
        <div className="flex-1 flex flex-col gap-8">
          {children}
        </div>
      </div>
    </main>
  );
}
