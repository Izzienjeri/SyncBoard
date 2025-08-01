import { useState, useMemo } from "react";
import useSWR, { MutatorCallback } from "swr";
import { toast } from "sonner";
import { User, UsersApiResponse } from "@/types/api.types";
import { addUser, updateUser, deleteUser as deleteUserApi, fetcher } from "@/lib/api";
import { UserFormValues } from "@/lib/schemas";

interface UseUserManagementProps {
  userType: 'student' | 'teacher';
  itemsPerPage: number;
  currentPage: number;
}

export function useUserManagement({ userType, itemsPerPage, currentPage }: UseUserManagementProps) {
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  const entityName = useMemo(() => (userType === 'student' ? 'Student' : 'Teacher'), [userType]);

  const skip = (currentPage - 1) * itemsPerPage;
  const swrKey = `/api/${userType}s?limit=${itemsPerPage}&skip=${skip}`;
  
  const { data, error, isLoading, mutate } = useSWR<UsersApiResponse>(swrKey, fetcher, { keepPreviousData: true });
  

  const handleFormSubmit = async (formData: UserFormValues, userId?: number) => {
    try {
      if (userId) {
        await updateUser(userType, userId, formData);
        toast.success(`${entityName} updated successfully!`);
      } else {
        await addUser(userType, formData);
        toast.success(`${entityName} added successfully.`);
      }
      mutate(); 
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to save ${entityName.toLowerCase()}.`;
      toast.error(message);
    }
  };
  
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
  
  const openCreateModal = () => {
    setUserToEdit(undefined);
    setIsFormModalOpen(true);
  };
  
  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setIsFormModalOpen(true);
  };
  
  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
  };

  const closeFormModal = () => setIsFormModalOpen(false);
  const closeDeleteDialog = () => setUserToDelete(null);

  return {
    data,
    error,
    isLoading,
    isFormModalOpen,
    userToEdit,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleFormSubmit,
    userToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteUser,
  };
}