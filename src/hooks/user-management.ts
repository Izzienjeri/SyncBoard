import { useState, useMemo } from "react";
import useSWR, { MutatorCallback } from "swr";
import { toast } from "sonner";
import { User, UsersApiResponse } from "@/types/api.types";
import { addUser, deleteUser as deleteUserApi, fetcher, updateUser } from "@/lib/api";

interface UseUserManagementProps {
  userType: 'student' | 'teacher';
  itemsPerPage: number;
  currentPage: number;
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
}

export function useUserManagement({ userType, itemsPerPage, currentPage, searchTerm, sortBy, sortOrder }: UseUserManagementProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const entityName = useMemo(() => (userType === 'student' ? 'Student' : 'Teacher'), [userType]);

  const skip = (currentPage - 1) * itemsPerPage;
  const swrKey = `/api/${userType}s?limit=${itemsPerPage}&skip=${skip}&search=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  
  const { data, error, isLoading, mutate } = useSWR<UsersApiResponse>(swrKey, fetcher, { keepPreviousData: true });

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
        await addUser(userType, userData);
        toast.success(`${entityName} added successfully.`);
        mutate(); 
    } catch (err) {
        const message = err instanceof Error ? err.message : `Failed to save ${entityName.toLowerCase()}.`;
        toast.error(message);
        throw err; // Re-throw to keep modal open on error
    }
  }

  const handleUpdateUser = async (userId: number, userData: Partial<User>) => {
    try {
      await updateUser(userType, userId, userData);
      toast.success(`${entityName} updated successfully.`);
      mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed.');
      throw err;
    }
  }
  
  const handleDeleteUser = async (userId: number) => {
    const optimisticData: MutatorCallback<UsersApiResponse> = (currentData) => {
      if (!currentData) return currentData;
      return { ...currentData, users: currentData.users.filter(u => u.id !== userId) };
    };
    await mutate(optimisticData, { revalidate: false });

    try {
      await deleteUserApi(userType, userId);
      toast.success(`${entityName} deleted successfully.`);
    } catch {
      toast.error(`Failed to delete ${entityName.toLowerCase()}.`);
      mutate();
    } finally {
      setUserToDelete(null);
    }
  };
  
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openDeleteDialog = (user: User) => setUserToDelete(user);
  const closeDeleteDialog = () => setUserToDelete(null);

  return {
    data,
    error,
    isLoading,
    mutate,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    handleCreateUser,
    handleUpdateUser,
    userToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteUser,
  };
}
