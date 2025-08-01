"use client";

import useSWR, { useSWRConfig } from "swr";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/features/customer/customer-table";
import { CustomerTableSkeleton } from "@/components/features/customer/customer-table-skeleton";
import { getUsers, updateUser } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { toast } from "sonner";
import { User, UsersApiResponse } from "@/types/api.types";
import { UserPreviewModal } from "@/components/features/customer/user-preview-modal";

const ITEMS_PER_PAGE = 10;
const STUDENT_COUNT = 100;

// This would be in lib/api.ts in a real app
const deleteUser = async (id: number) => {
  // Mocking deletion as dummyjson doesn't support it on all records
  return Promise.resolve({ id, isDeleted: true });
}

export default function StudentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const swrKey = `https://dummyjson.com/users?limit=${ITEMS_PER_PAGE}&skip=${(currentPage - 1) * ITEMS_PER_PAGE}`;
  const { data, error, isLoading, mutate } = useSWR(swrKey, getUsers);
  const { mutate: globalMutate } = useSWRConfig();

  const handleUserUpdate = async (id: number, userData: Partial<User>) => {
    await mutate(async (currentData?: UsersApiResponse) => {
      if (!currentData) return currentData;
      const updatedUsers = currentData.users.map(u => u.id === id ? { ...u, ...userData } : u);
      return { ...currentData, users: updatedUsers };
    }, { revalidate: false });

    try {
      await updateUser(id, userData);
      toast.success("Student updated successfully!");
    } catch {
      toast.error("Failed to update student.");
    } finally {
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
        toast.success("Student deleted successfully.");
    } catch {
        toast.error("Failed to delete student.");
        globalMutate(swrKey);
    }
  };

  const renderContent = () => {
    if (isLoading) return <CustomerTableSkeleton type="student" />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load students. Please try again.</AlertDescription>
      </Alert>
    );
    if (!data?.users.length) return <p>No students found.</p>;
    
    return <CustomerTable 
      customers={data.users} 
      type="student" 
      startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
      onUserUpdate={handleUserUpdate}
      onViewUser={handleViewUser}
      onDeleteUser={handleDeleteUser}
    />
  };

  return (
    <>
      <PageHeader
        title="Student Management"
        description="View and manage student profiles."
      />
      {renderContent()}
      {data && STUDENT_COUNT > ITEMS_PER_PAGE && (
        <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(STUDENT_COUNT / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
        />
      )}
      <UserPreviewModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        user={selectedUser}
      />
    </>
  );
}
