"use client";

import { useState } from "react";
import useSWR from "swr";
import { AlertTriangle, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addSubject, getSubjects, getAllTeachers, updateSubject, deleteSubject } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import { AddSubjectModal } from "@/components/features/subject/add-subject-modal";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { EditSubjectModal } from "@/components/features/subject/EditSubjectModal";
import { Teacher } from "@/lib/fake-generators";

const TeacherAvatar = ({ teacherName }: { teacherName: string }) => {
  const initials = teacherName.split(' ').map((n) => n[0]).slice(0, 2).join('');
  return (
    <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center border-2 border-background group-hover:border-muted transition-colors">
      <span className="text-xs font-semibold text-muted-foreground">{initials}</span>
    </div>
  );
};

export default function SubjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<string | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  const { data: subjects, error: subjectsError, isLoading: subjectsLoading, mutate: mutateSubjects } = useSWR("/api/subjects", getSubjects);
  const { data: allTeachers, isLoading: teachersLoading } = useSWR("/api/teachers/all", getAllTeachers);

  const handleSubjectAdded = async (newSubjectName: string) => {
    try {
      const newSubject = await addSubject(newSubjectName);
      toast.success(`Subject "${newSubject.name}" added successfully.`);
      mutateSubjects();
    } catch (e: unknown) {
      if (e instanceof Error) toast.error(e.message);
    }
  };

  const handleSubjectUpdated = async (oldName: string, newName: string) => {
    try {
        await updateSubject(oldName, newName);
        toast.success(`Subject renamed to "${newName}"`);
        mutateSubjects();
    } catch(e: unknown) {
        if (e instanceof Error) toast.error(e.message);
    }
  };

  const handleDeleteSubject = async (subjectName: string) => {
    try {
        await deleteSubject(subjectName);
        toast.success(`Subject "${subjectName}" deleted.`);
        mutateSubjects();
    } catch(e: unknown) {
        if (e instanceof Error) toast.error(e.message);
    }
  };
  
  const totalPages = subjects ? Math.ceil(subjects.length / itemsPerPage) : 0;

  const renderContent = () => {
    if (subjectsLoading || teachersLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      );
    }
    if (subjectsError) {
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
        {paginatedSubjects.map((subject) => {
          const teachersForSubject = allTeachers?.filter((t: Teacher) => t.subject === subject) || [];
          return (
            <Card key={subject} className="glass-card flex flex-col hover:border-primary/50 transition-colors duration-300">
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle className="capitalize text-lg text-primary">{subject}</CardTitle>
                  <p className="text-sm text-muted-foreground pt-1">
                    {teachersForSubject.length} {teachersForSubject.length === 1 ? 'Instructor' : 'Instructors'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSubjectToEdit(subject)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setSubjectToDelete(subject)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                {teachersForSubject.length > 0 ? (
                  <div className="flex -space-x-3 overflow-hidden">
                    {teachersForSubject.slice(0, 5).map(teacher => (
                      <div key={teacher.id} className="group" title={teacher.firstName + ' ' + teacher.lastName}>
                        <TeacherAvatar teacherName={teacher.firstName + ' ' + teacher.lastName} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No instructors assigned.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subjects Overview" description="View and manage all subjects offered.">
        <Button onClick={() => setIsAddModalOpen(true)} className="button-gradient">
          <PlusCircle className="h-4 w-4 mr-2"/> Add Subject
        </Button>
      </PageHeader>
      {renderContent()}
      {subjects && subjects.length > 0 && (
         <TablePaginationControls
            currentPage={currentPage} totalPages={totalPages}
            onPageChange={setCurrentPage} itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}
            totalItems={subjects.length} itemType="subjects"
            itemsPerPageOptions={[6, 9, 12, 15]}
         />
      )}
      <ConfirmationDialog
        isOpen={!!subjectToDelete}
        onOpenChange={(isOpen) => !isOpen && setSubjectToDelete(null)}
        onConfirm={() => {
          if (subjectToDelete) handleDeleteSubject(subjectToDelete);
        }}
        title="Are you sure?"
        description={`This will permanently delete the subject "${subjectToDelete}". This action cannot be undone.`}
        confirmText="Yes, delete"
      />
      <AddSubjectModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubjectAdded={handleSubjectAdded} />
      {subjectToEdit && (
        <EditSubjectModal
            isOpen={!!subjectToEdit}
            onOpenChange={(isOpen) => !isOpen && setSubjectToEdit(null)}
            subjectName={subjectToEdit}
            onSubjectUpdated={handleSubjectUpdated}
        />
      )}
    </div>
  );
}