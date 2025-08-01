import { useState, useMemo } from "react";
import useSWR, { MutatorCallback } from "swr";
import { toast } from "sonner";
import { UsersApiResponse } from "@/types/api.types";
import { addUser, deleteUser as deleteUserApi, fetcher, updateUser } from "@/lib/api";
import { UserFormValues } from "@/lib/schemas";
import { AppUser } from "@/lib/fake-generators";

interface UseUserManagementProps {
  userType: 'student' | 'teacher';
  itemsPerPage: number;
  currentPage: number;
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
}

export function useUserManagement({ userType, itemsPerPage, currentPage, searchTerm, sortBy, sortOrder }: UseUserManagementProps) {
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  const entityName = useMemo(() => (userType === 'student' ? 'Student' : 'Teacher'), [userType]);

  const skip = (currentPage - 1) * itemsPerPage;
  const swrKey = `/api/${userType}s?limit=${itemsPerPage}&skip=${skip}&search=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  
  const { data, error, isLoading, mutate } = useSWR<UsersApiResponse>(swrKey, fetcher, { keepPreviousData: true });

  const handleCreateUser = async (userData: Partial<AppUser>) => {
    // Add the discriminator type for creation
    const finalUserData = { ...userData, type: userType };
    await addUser(userType, finalUserData);
    toast.success(`${entityName} added successfully.`);
    mutate(); 
  }

  const handleUpdateUser = async (userId: number, userData: Partial<AppUser>) => {
    await updateUser(userType, userId, userData);
    toast.success(`${entityName} updated successfully.`);
    mutate();
  }

  const handleFormSubmit = async (formData: UserFormValues) => {
    try {
      if (userToEdit) {
        await handleUpdateUser(userToEdit.id, formData);
      } else {
        await handleCreateUser(formData);
      }
      closeFormModal();
    } catch(err) {
      const message = err instanceof Error ? err.message : `Failed to save ${entityName.toLowerCase()}.`;
      toast.error(message);
      throw err;
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
  
  const openCreateModal = () => { setUserToEdit(null); setIsFormModalOpen(true); };
  const openEditModal = (user: AppUser) => { setUserToEdit(user); setIsFormModalOpen(true); };
  const closeFormModal = () => setIsFormModalOpen(false);
  const openDeleteDialog = (user: AppUser) => setUserToDelete(user);
  const closeDeleteDialog = () => setUserToDelete(null);

  return {
    data, error, isLoading, isFormModalOpen,
    openCreateModal, openEditModal, closeFormModal, handleFormSubmit,
    userToEdit, userToDelete, openDeleteDialog, closeDeleteDialog, handleDeleteUser,
  };
}
