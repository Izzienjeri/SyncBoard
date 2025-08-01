"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import { useUserManagement } from "@/hooks/user-management";
import { PageHeader } from "@/components/shared/page-header";
import { UserTable } from "@/components/features/user/user-table";
import { UserTableSkeleton } from "@/components/features/user/user-table-skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "./user-form-modal";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserManagementPageProps {
  userType: 'student' | 'teacher';
  pageTitle: string;
  pageDescription: string;
}

export function UserManagementPage({ userType, pageTitle, pageDescription }: UserManagementPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');

  const { sortBy, sortOrder } = useMemo(() => {
    const [by, order] = sortOption.split('-');
    return { sortBy: by, sortOrder: order };
  }, [sortOption]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data, error, isLoading, handleFormSubmit,
    isFormModalOpen, openCreateModal, openEditModal, closeFormModal, userToEdit,
    userToDelete, openDeleteDialog, closeDeleteDialog, handleDeleteUser
  } = useUserManagement({ userType, itemsPerPage, currentPage, searchTerm: debouncedSearchTerm, sortBy, sortOrder });
  
  const totalCount = data?.total;
  
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return (
    <>
      <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
        <div className="p-4 sm:p-6 space-y-4">
          <PageHeader title={pageTitle} description={pageDescription}>
            <Button onClick={openCreateModal} className="button-gradient">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New {userType}
            </Button>
          </PageHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${userType}s by name or email...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                {userType === 'student' && <>
                    <SelectItem value="grade-asc">Grade (A-F)</SelectItem>
                    <SelectItem value="grade-desc">Grade (F-A)</SelectItem>
                </>}
                {userType === 'teacher' && <>
                    <SelectItem value="subject-asc">Subject (A-Z)</SelectItem>
                    <SelectItem value="subject-desc">Subject (Z-A)</SelectItem>
                </>}
              </SelectContent>
            </Select>
          </div>
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
              onDelete={openDeleteDialog}
              onEdit={openEditModal}
            />
          )}
        </div>

        {data && (data.users.length > 0 || searchTerm) && (
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
        userType={userType}
        onSubmit={handleFormSubmit}
        initialData={userToEdit}
      />
      
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
