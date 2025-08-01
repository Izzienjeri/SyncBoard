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

// This would be in lib/api.ts in a real app
const deleteUser = async (id: number) => {
  // Mocking deletion as dummyjson doesn't support it on all records
  return Promise.resolve({ id, isDeleted: true });
}

export default function TeachersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const swrKey = `https://dummyjson.com/users?limit=${ITEMS_PER_PAGE}&skip=${100 + (currentPage - 1) * ITEMS_PER_PAGE}`;
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
      toast.success("Teacher updated successfully!");
    } catch {
      toast.error("Failed to update teacher.");
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
        toast.success("Teacher deleted successfully.");
    } catch {
        toast.error("Failed to delete teacher.");
        globalMutate(swrKey);
    }
  };

  const renderContent = () => {
    if (isLoading) return <CustomerTableSkeleton type="teacher" />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load teachers. Please try again.</AlertDescription>
      </Alert>
    );
    if (!data?.users.length) return <p>No teachers found.</p>;
    
    return <CustomerTable 
      customers={data.users} 
      type="teacher"
      startIndex={100 + (currentPage - 1) * ITEMS_PER_PAGE}
      onUserUpdate={handleUserUpdate}
      onViewUser={handleViewUser}
      onDeleteUser={handleDeleteUser}
    />
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Teacher Management"
        description="View and manage teacher profiles."
      />
      {renderContent()}
      {data && data.total > 100 && (
        <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((data.total - 100) / ITEMS_PER_PAGE)}
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
