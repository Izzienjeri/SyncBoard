"use client";

import useSWR from "swr";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/features/customer/customer-table";
import { CustomerTableSkeleton } from "@/components/features/customer/customer-table-skeleton";
import { getUsers, updateUser } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "@/types/api.types";

const ITEMS_PER_PAGE = 10;

export default function TeachersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading, mutate } = useSWR(
    `https://dummyjson.com/users?limit=${ITEMS_PER_PAGE}&skip=${100 + (currentPage - 1) * ITEMS_PER_PAGE}`,
    getUsers
  );

  const handleUserUpdate = async (id: number, userData: Partial<User>) => {
    const optimisticData = { ...data!, users: data!.users.map(u => u.id === id ? { ...u, ...userData } : u) };
    await mutate(optimisticData, false);
    try {
      await updateUser(id, userData);
      toast.success("Teacher updated successfully!");
    } catch {
      toast.error("Failed to update teacher.");
      mutate(); // Revalidate to get original data
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
    </div>
  );
}
