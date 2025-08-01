"use client";

import useSWR from "swr";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { useUserManagement } from "@/hooks/user-management";
import { PageHeader } from "@/components/shared/page-header";
import { UserTable } from "@/components/features/user/user-table";
import { UserTableSkeleton } from "@/components/features/user/user-table-skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import { getTotalStudents, getTotalTeachers } from "@/lib/api";
import { User } from "@/types/api.types";
import type { UserPreviewModalProps } from "./user-preview-modal";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "./user-form-modal";
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
  const [selectedUserForView, setSelectedUserForView] = useState<User | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const {
    data, error, isLoading,
    isFormModalOpen, userToEdit, openCreateModal, openEditModal, closeFormModal, handleFormSubmit,
    userToDelete, openDeleteDialog, closeDeleteDialog, handleDeleteUser
  } = useUserManagement({ userType, itemsPerPage, currentPage });
  
  const { data: totalCount, isLoading: totalLoading } = useSWR(
    userType === 'student' ? 'totalStudents' : 'totalTeachers',
    userType === 'student' ? getTotalStudents : getTotalTeachers
  );

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handleViewUser = (user: User) => {
    setSelectedUserForView(user);
    setIsViewModalOpen(true);
  };

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return (
    <>
      <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
        <div className="p-4 sm:p-6">
          <PageHeader title={pageTitle} description={pageDescription}>
            <Button onClick={openCreateModal} className="button-gradient">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New {userType}
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
              onViewUser={handleViewUser}
              onEditUser={openEditModal}
              onDeleteUser={openDeleteDialog}
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

      <UserFormModal
        isOpen={isFormModalOpen}
        onOpenChange={closeFormModal}
        userToEdit={userToEdit}
        userType={userType}
        onSubmit={handleFormSubmit}
      />

      {isViewModalOpen && (
        <UserPreviewModal
            isOpen={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            user={selectedUserForView}
        />
      )}

      <ConfirmationDialog
        isOpen={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && closeDeleteDialog()}
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