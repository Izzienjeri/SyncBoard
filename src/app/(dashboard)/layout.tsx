import { StudentDashboardSidebar } from "@/components/dashboard/student-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-card p-6 shadow-xl lg:p-8 flex flex-col lg:flex-row gap-8">
        <StudentDashboardSidebar />
        <div className="flex-1 flex flex-col gap-8">
          {children}
        </div>
      </div>
    </main>
  );
}