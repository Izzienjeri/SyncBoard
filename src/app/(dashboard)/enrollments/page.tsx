"use client";

import useSWR from "swr";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EnrollmentTable } from "@/components/features/enrollment/enrollment-table";
import { EnrollmentTableSkeleton } from "@/components/features/enrollment/enrollment-table-skeleton";
import { getEnrollments } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function EnrollmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useSWR(
    `https://dummyjson.com/carts?limit=${ITEMS_PER_PAGE}&skip=${(currentPage - 1) * ITEMS_PER_PAGE}`,
    getEnrollments
  );

  const renderContent = () => {
    if (isLoading) return <EnrollmentTableSkeleton />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load enrollments. Please try again.</AlertDescription>
      </Alert>
    );
    if (!data?.carts.length) return <p>No enrollments found.</p>;
    
    return <EnrollmentTable enrollments={data.carts} />
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Enrollment Management"
        description="View all student course enrollments."
      />
      {renderContent()}
      {data && data.total > ITEMS_PER_PAGE && (
        <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data.total / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}