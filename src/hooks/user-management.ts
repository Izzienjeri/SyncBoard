import { useState } from "react";
import useSWR, { useSWRConfig, MutatorCallback } from "swr";
import { toast } from "sonner";
import { User, UsersApiResponse } from "@/types/api.types";
import { updateUser } from "@/lib/api";

// Mocking deletion as dummyjson doesn't support it on all records
const deleteUser = async (id: number) => Promise.resolve({ id, isDeleted: true });

interface UseUserManagementProps<T> {
  fetcher: (key: string) => Promise<T>;
  swrKey: string;
  entityName: 'Student' | 'Teacher';
}

export function useUserManagement<T extends UsersApiResponse>({ fetcher, swrKey, entityName }: UseUserManagementProps<T>) {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher);
  const { mutate: globalMutate } = useSWRConfig();

  const handleUserUpdate = async (id: number, userData: Partial<User>) => {
    const optimisticData: MutatorCallback<T> = (currentData) => {
      if (!currentData) return currentData;
      const updatedUsers = currentData.users.map(u => u.id === id ? { ...u, ...userData } : u);
      return { ...currentData, users: updatedUsers } as T;
    };
    await mutate(optimisticData, { revalidate: false });

    try {
      await updateUser(id, userData);
      toast.success(`${entityName} updated successfully!`);
    } catch {
      toast.error(`Failed to update ${entityName.toLowerCase()}.`);
    } finally {
      globalMutate(swrKey);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    const optimisticData: MutatorCallback<T> = (currentData) => {
      if (!currentData) return currentData;
      const updatedUsers = currentData.users.filter(u => u.id !== userId);
      return { ...currentData, users: updatedUsers } as T;
    };
    await mutate(optimisticData, { revalidate: false });

    try {
      await deleteUser(userId);
      toast.success(`${entityName} deleted successfully.`);
    } catch {
      toast.error(`Failed to delete ${entityName.toLowerCase()}.`);
      globalMutate(swrKey);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    // Add a small delay to allow the modal to animate out before clearing the user
    setTimeout(() => setSelectedUser(undefined), 300);
  };

  return {
    data,
    error,
    isLoading,
    selectedUser,
    isViewModalOpen,
    handleUserUpdate,
    handleViewUser,
    handleDeleteUser,
    setIsViewModalOpen: closeViewModal,
  };
}
