"use client";

import useSWR, { useSWRConfig } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { UserTable } from "@/components/features/user/user-table";
import { UserTableSkeleton } from "@/components/features/user/user-table-skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls"; // NEW
import { getUsers, updateUser, deleteUser, getTotalStudents, getTotalTeachers } from "@/lib/api";
import { User, UsersApiResponse } from "@/types/api.types";
import type { UserPreviewModalProps } from "./user-preview-modal";

const UserPreviewModal = dynamic<UserPreviewModalProps>(() => import("@/components/features/user/user-preview-modal").then(mod => mod.UserPreviewModal));

interface UserManagementPageProps {
  userType: 'student' | 'teacher';
  pageTitle: string;
  pageDescription: string;
}

export function UserManagementPage({ userType, pageTitle, pageDescription }: UserManagementPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  // IMPROVEMENT: Added state for items per page
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const { mutate: globalMutate } = useSWRConfig();

  // Updated to use itemsPerPage state
  const skip = userType === 'student' 
    ? (currentPage - 1) * itemsPerPage 
    : 100 + (currentPage - 1) * itemsPerPage;
  const swrKey = `https://dummyjson.com/users?limit=${itemsPerPage}&skip=${skip}`;
  
  const { data, error, isLoading, mutate } = useSWR(swrKey, getUsers, { keepPreviousData: true });
  const { data: totalCount, isLoading: totalLoading } = useSWR(
    userType === 'student' ? 'totalStudents' : 'totalTeachers',
    userType === 'student' ? getTotalStudents : getTotalTeachers
  );

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page to avoid invalid page numbers
  };
  
  const handleUserUpdate = async (id: number, userData: Partial<User>) => {
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
      globalMutate(swrKey);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    await mutate(async (currentData?: UsersApiResponse) => {
      if (!currentData) return currentData;
      return { ...currentData, users: currentData.users.filter(u => u.id !== userId) };
    }, { revalidate: false });

    try {
      await deleteUser(userId);
      toast.success(`${userType === 'student' ? 'Student' : 'Teacher'} deleted successfully.`);
    } catch {
      toast.error(`Failed to delete ${userType}.`);
      globalMutate(swrKey);
    }
  };

  const renderContent = () => {
    if (isLoading && !data) return <UserTableSkeleton type={userType} items={itemsPerPage} />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load {userType}s. Please try again.</AlertDescription>
      </Alert>
    );
    if (!data?.users.length) return <p className="py-10 text-center text-muted-foreground">No {userType}s found.</p>;
    
    return <UserTable
      users={data.users}
      type={userType}
      onUserUpdate={handleUserUpdate}
      onViewUser={handleViewUser}
      onDeleteUser={handleDeleteUser}
    />
  };

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      />
      {renderContent()}

      {/* IMPROVEMENT: Replaced old pagination with the new comprehensive controls component */}
      {!totalLoading && (
         <TablePaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={totalCount ?? 0}
            itemType={`${userType}s`}
         />
      )}

      {isViewModalOpen && (
        <UserPreviewModal
            isOpen={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            user={selectedUser}
        />
      )}
    </div>
  );
}
