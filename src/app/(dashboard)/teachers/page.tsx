"use client";

import useSWR from "swr";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/features/customer/customer-table";
import { CustomerTableSkeleton } from "@/components/features/customer/customer-table-skeleton";
import { getUsers } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function TeachersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useSWR(
    `https://dummyjson.com/users?limit=${ITEMS_PER_PAGE}&skip=${100 + (currentPage - 1) * ITEMS_PER_PAGE}`,
    getUsers
  );

  const renderContent = () => {
    if (isLoading) return <CustomerTableSkeleton />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load teachers. Please try again.</AlertDescription>
      </Alert>
    );
    if (!data?.users.length) return <p>No teachers found.</p>;
    
    return <CustomerTable customers={data.users} />
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Teacher Management"
        description="View and manage teacher profiles."
      />
      {renderContent()}
      {data && (data.total - 100) > ITEMS_PER_PAGE && (
        <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((data.total - 100) / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}