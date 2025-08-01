import { UserManagementPage } from "@/components/features/user/user-management-page";

export default function StudentsPage() {
  return (
    <UserManagementPage
      userType="student"
      pageTitle="Student Management"
      pageDescription="View and manage student profiles."
    />
  );
}
