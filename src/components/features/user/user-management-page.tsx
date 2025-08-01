"use client";

import useSWR, { useSWRConfig } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { AlertTriangle, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { UserTable } from "@/components/features/user/user-table";
import { UserTableSkeleton } from "@/components/features/user/user-table-skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import { getUsers, updateUser, deleteUser, getTotalStudents, getTotalTeachers, addUser } from "@/lib/api";
import { User, UsersApiResponse } from "@/types/api.types";
import type { UserPreviewModalProps } from "./user-preview-modal";
import { Button } from "@/components/ui/button";
import { AddUserModal } from "./add-user-modal";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

const UserPreviewModal = dynamic<UserPreviewModalProps>(() => import("@/components/features/user/user-preview-modal").then(mod => mod.UserPreviewModal));

interface UserManagementPageProps {
  userType: 'student' | 'teacher';
  pageTitle: string;
  pageDescription: string;
}

export function UserManagementPage({ userType, pageTitle, pageDescription }: UserManagementPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { mutate: globalMutate } = useSWRConfig();

  const skip = userType === 'student' 
    ? (currentPage - 1) * itemsPerPage 
    : 100 + (currentPage - 1) * itemsPerPage;
  const swrKey = `https://dummyjson.com/users?limit=${itemsPerPage}&skip=${skip}`;
  
  const { data, error, isLoading, mutate } = useSWR(swrKey, getUsers, { keepPreviousData: true });
  const { data: totalCount, isLoading: totalLoading, mutate: mutateTotalCount } = useSWR(
    userType === 'student' ? 'totalStudents' : 'totalTeachers',
    userType === 'student' ? getTotalStudents : getTotalTeachers
  );

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
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

  const promptDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = async (userId: number) => {
    await mutate(async (currentData?: UsersApiResponse) => {
      if (!currentData) return currentData;
      return { ...currentData, users: currentData.users.filter(u => u.id !== userId) };
    }, { revalidate: false });

    mutateTotalCount((count) => (count ? count - 1 : 0), false);

    try {
      await deleteUser(userId);
      toast.success(`${userType === 'student' ? 'Student' : 'Teacher'} deleted successfully.`);
    } catch {
      toast.error(`Failed to delete ${userType}.`);
      globalMutate(swrKey);
      mutateTotalCount();
    }
  };

  const handleUserAdded = (newUser: User) => {
    toast.success(`${userType === 'student' ? 'Student' : 'Teacher'} "${newUser.firstName} ${newUser.lastName}" added successfully.`);
    mutateTotalCount((count) => (count ? count + 1 : 1), false);
    globalMutate(swrKey);
  };

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return (
    <>
      <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
        <div className="p-4 sm:p-6">
          <PageHeader
            title={pageTitle}
            description={pageDescription}
          >
            <Button onClick={() => setIsAddModalOpen(true)} className="button-gradient">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New {userType === 'student' ? 'Student' : 'Teacher'}
            </Button>
          </PageHeader>
        </div>

        <div className="overflow-x-auto">
          {isLoading && !data && <UserTableSkeleton type={userType} items={itemsPerPage} />}
          {error && (
            <Alert variant="destructive" className="glass-card m-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load {userType}s. Please try again.</AlertDescription>
            </Alert>
          )}
          {data && !data.users.length && <p className="py-10 text-center text-muted-foreground">No {userType}s found.</p>}
          {data?.users && data.users.length > 0 && (
            <UserTable
              users={data.users}
              type={userType}
              onUserUpdate={handleUserUpdate}
              onViewUser={handleViewUser}
              onDeleteUser={promptDeleteUser}
            />
          )}
        </div>

        {!totalLoading && data && data.users.length > 0 && (
          <div className="p-4 border-t">
            <TablePaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={totalCount ?? 0}
              itemType={`${userType}s`}
            />
          </div>
        )}
      </div>

      {isViewModalOpen && (
        <UserPreviewModal
            isOpen={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            user={selectedUser}
        />
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onUserAdded={handleUserAdded}
        userType={userType}
        addUserApi={addUser}
      />

      <ConfirmationDialog
        isOpen={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            handleDeleteUser(userToDelete.id);
          }
        }}
        title={`Delete ${userType}?`}
        description={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? All of their data will be removed.`}
        confirmText={`Yes, delete ${userType}`}
      />
    </>
  );
}