"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/features/customer/customer-table";
import { CustomerTableSkeleton } from "@/components/features/customer/customer-table-skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Pagination } from "@/components/ui/pagination";
import { UserPreviewModal } from "@/components/features/customer/user-preview-modal";

import { getUsers, updateUser, deleteUser, getTotalStudents, getTotalTeachers } from "@/lib/api";
import { User, UsersApiResponse } from "@/types/api.types";
import { subjectTeacherMapping } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 10;

interface UserManagementPageProps {
  userType: 'student' | 'teacher';
  pageTitle: string;
  pageDescription: string;
}

export function UserManagementPage({ userType, pageTitle, pageDescription }: UserManagementPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const skip = userType === 'student' ? (currentPage - 1) * ITEMS_PER_PAGE : 100 + (currentPage - 1) * ITEMS_PER_PAGE;
  const swrKey = `https://dummyjson.com/users?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
  
  const { data, error, isLoading, mutate } = useSWR(swrKey, getUsers, { keepPreviousData: true });
  const { data: totalCount, isLoading: totalLoading } = useSWR(
    userType === 'student' ? 'totalStudents' : 'totalTeachers',
    userType === 'student' ? getTotalStudents : getTotalTeachers
  );

  const teacherSubjects = useMemo(() => {
    if (userType !== 'teacher') return undefined;
    const mapping: Record<number, string[]> = {};
    for (const subject in subjectTeacherMapping) {
        for (const teacherId of subjectTeacherMapping[subject]) {
            if (!mapping[teacherId]) {
                mapping[teacherId] = [];
            }
            mapping[teacherId].push(subject);
        }
    }
    return mapping;
  }, [userType]);

  const handleUserUpdate = async (id: number, userData: Partial<User>) => {
    // Optimistic UI update
    await mutate(async (currentData?: UsersApiResponse) => {
      if (!currentData) return currentData;
      const updatedUsers = currentData.users.map(u => u.id === id ? { ...u, ...userData } : u);
      return { ...currentData, users: updatedUsers };
    }, { revalidate: false });

    try {
      await updateUser(id, userData);
      toast.success(`${userType === 'student' ? 'Student' : 'Teacher'} updated successfully!`);
    } catch {
      toast.error(`Failed to update ${userType}.`);
      mutate(); // Revalidate to get the correct server state
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    const originalData = data;
    // Optimistic UI update
    await mutate(async (currentData?: UsersApiResponse) => {
      if (!currentData) return currentData;
      return { ...currentData, users: currentData.users.filter(u => u.id !== userId) };
    }, { revalidate: false });

    try {
      await deleteUser(userId);
      toast.success(`${userType === 'student' ? 'Student' : 'Teacher'} deleted successfully.`);
    } catch {
      toast.error(`Failed to delete ${userType}.`);
      mutate(originalData); // Revert on failure
    }
  };

  const renderContent = () => {
    if (isLoading && !data) return <CustomerTableSkeleton type={userType} />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load {userType}s. Please try again.</AlertDescription>
      </Alert>
    );
    if (!data?.users.length) return <p className="py-10 text-center text-muted-foreground">No {userType}s found.</p>;
    
    return <CustomerTable
      customers={data.users}
      type={userType}
      startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
      onUserUpdate={handleUserUpdate}
      onViewUser={handleViewUser}
      onDeleteUser={handleDeleteUser}
      teacherSubjects={teacherSubjects}
    />
  };

  const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      />
      {renderContent()}
      {!totalLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      <UserPreviewModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        user={selectedUser}
      />
    </div>
  );
}
