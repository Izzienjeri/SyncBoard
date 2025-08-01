import { useState, useMemo } from "react";
import useSWR, { useSWRConfig, MutatorCallback } from "swr";
import { toast } from "sonner";
import { User, UsersApiResponse } from "@/types/api.types";
import { addUser, updateUser, deleteUser as deleteUserApi } from "@/lib/api";
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

  const skip = userType === 'student'
    ? (currentPage - 1) * itemsPerPage
    : 100 + (currentPage - 1) * itemsPerPage;
  const swrKey = `https://dummyjson.com/users?limit=${itemsPerPage}&skip=${skip}`;
  
  const { data, error, isLoading, mutate } = useSWR<UsersApiResponse>(swrKey, url => fetch(url).then(res => res.json()), { keepPreviousData: true });
  const { mutate: globalMutate } = useSWRConfig();

  const handleFormSubmit = async (formData: UserFormValues, userId?: number) => {
    const optimisticDataCallback: MutatorCallback<UsersApiResponse> = (currentData) => {
      if (!currentData) return currentData;
      
      if (userId) {
        const updatedUsers = currentData.users.map(u => u.id === userId ? { ...u, ...formData } : u);
        return { ...currentData, users: updatedUsers };
      } else {
        return currentData;
      }
    };
    await mutate(optimisticDataCallback, { revalidate: false });

    try {
      if (userId) {
        await updateUser(userId, formData);
        toast.success(`${entityName} updated successfully!`);
      } else {
        await addUser(formData);
        toast.success(`${entityName} added successfully.`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to save ${entityName.toLowerCase()}.`;
      toast.error(message);
    } finally {
      globalMutate(swrKey);
    }
  };
  
  const handleDeleteUser = async (userId: number) => {
    const optimisticData: MutatorCallback<UsersApiResponse> = (currentData) => {
      if (!currentData) return currentData;
      return { ...currentData, users: currentData.users.filter(u => u.id !== userId) };
    };
    await mutate(optimisticData, { revalidate: false });

    try {
      await deleteUserApi(userId);
      toast.success(`${entityName} deleted successfully.`);
    } catch {
      toast.error(`Failed to delete ${entityName.toLowerCase()}.`);
      globalMutate(swrKey);
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
    swrKey,
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