import { UserManagementPage } from "@/components/features/user/user-management-page";

export default function TeachersPage() {
  return (
    <UserManagementPage
      userType="teacher"
      pageTitle="Teacher Management"
      pageDescription="View and manage teacher profiles."
    />
  );
}
