import { StudentDashboardSidebar } from "@/components/dashboard/student-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8 background-gradient-custom">
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-card/90 p-4 shadow-xl backdrop-blur-lg sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-start">
        <StudentDashboardSidebar />
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          {children}
        </div>
      </div>
    </main>
  );
}
