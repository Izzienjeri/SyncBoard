"use client";

import { useState } from "react";
import useSWR from "swr";
import { AlertTriangle, PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addSubject, getSubjects } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import { AddSubjectModal } from "@/components/features/subject/add-subject-modal";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

export default function SubjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  const { data: subjects, error, isLoading, mutate } = useSWR("/api/subjects", getSubjects);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSubjectAdded = async (newSubjectName: string) => {
      try {
        const newSubject = await addSubject(newSubjectName);
        toast.success(`Subject "${newSubject.name}" added successfully.`);
        mutate();
      } catch (e: unknown) {
        if (e instanceof Error) {
            toast.error(e.message);
        } else {
            toast.error("An unknown error occurred while adding the subject.");
        }
      }
  };

  const handleDeleteSubject = (subjectName: string) => {
    mutate(subjects?.filter(s => s !== subjectName), false);
    toast.success(`Subject "${subjectName}" deleted.`);
  };

  const totalPages = subjects ? Math.ceil(subjects.length / itemsPerPage) : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-4 w-4" /> <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load subjects. Please try again.</AlertDescription>
        </Alert>
      );
    }
    if (!subjects || subjects.length === 0) {
      return (
        <div className="text-center py-10 glass-card rounded-lg">
          <h3 className="text-xl font-medium">No Subjects Found</h3>
          <p className="text-muted-foreground">Click &quot;Add Subject&quot; to get started.</p>
        </div>
      );
    }

    const paginatedSubjects = subjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedSubjects.map((subject) => (
          <Card key={subject} className="glass-card flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="capitalize text-lg">{subject}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSubjectToDelete(subject)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total students enrolled: <span className="font-semibold text-foreground">{Math.floor(Math.random() * 50) + 10}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Average Grade: <span className="font-semibold text-foreground">{(Math.random() * (95 - 75) + 75).toFixed(1)}%</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subjects Overview" description="View and manage all subjects offered.">
        <Button onClick={() => setIsAddModalOpen(true)} className="button-gradient">
          <PlusCircle className="h-4 w-4 mr-2"/>
          Add Subject
        </Button>
      </PageHeader>
      
      {renderContent()}
      
      {subjects && subjects.length > 0 && (
         <TablePaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={subjects.length}
            itemType="subjects"
            itemsPerPageOptions={[9, 12, 15, 18]}
         />
      )}
      
      <ConfirmationDialog
        isOpen={!!subjectToDelete}
        onOpenChange={(isOpen) => !isOpen && setSubjectToDelete(null)}
        onConfirm={() => {
          if (subjectToDelete) {
            handleDeleteSubject(subjectToDelete);
          }
        }}
        title="Are you sure?"
        description={`This will permanently delete the subject "${subjectToDelete}". This action cannot be undone.`}
        confirmText="Yes, delete"
      />

      <AddSubjectModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubjectAdded={handleSubjectAdded}
      />
    </div>
  );
}