"use client";

import { useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSubjects } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTeachers, subjectTeacherMapping, subjectScoreData, Teacher } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types/api.types";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import type { UserPreviewModalProps } from "@/components/features/user/user-preview-modal";

const ManageInstructorsModal = dynamic(() => import("@/components/features/subject/manage-instructors-modal").then(mod => mod.ManageInstructorsModal));
const UserPreviewModal = dynamic<UserPreviewModalProps>(() => import("@/components/features/user/user-preview-modal").then(mod => mod.UserPreviewModal));

type Period = "this_term" | "last_term" | "full_year";

const TeacherAvatar = ({ teacherName }: { teacherName: string }) => {
  const initials = teacherName.split(' ').map((n) => n[0]).slice(0, 2).join('');
  return (
    <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
      <span className="text-xs font-semibold text-muted-foreground">{initials}</span>
    </div>
  );
};

export default function SubjectsPage() {
  const [period, setPeriod] = useState<Period>("this_term");
  // IMPROVEMENT: Added state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9); // Default to 9 for a 3x3 grid
  
  const { data: subjects, error, isLoading, mutate } = useSWR("subjects", getSubjects);
  const { data: allUsers } = useSWR<User[]>(`https://dummyjson.com/users?limit=200`, async (url: string) => (await fetch(url)).json().then(res => res.users));

  const [modalState, setModalState] = useState<{
    manageInstructors: boolean;
    viewTeacher: boolean;
    subject: string | null;
    teacher: User | null;
  }>({ manageInstructors: false, viewTeacher: false, subject: null, teacher: null });
  
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  const handleDeleteSubject = (subjectToDelete: string) => {
    mutate(subjects?.filter(s => s !== subjectToDelete), false);
    toast.success(`Subject "${subjectToDelete.replace(/-/g, ' ')}" deleted.`);
  };

  const handleManageInstructors = (subject: string) => {
    setModalState({ ...modalState, manageInstructors: true, subject });
  };
  
  const handleViewTeacher = (teacherId: number) => {
    const teacherUser = allUsers?.find(u => u.id === teacherId);
    if(teacherUser) {
        setModalState({ ...modalState, viewTeacher: true, teacher: teacherUser });
    } else {
        toast.warning("Could not find full details for this teacher.");
    }
  };

  const handleSaveInstructors = (subject: string, newTeacherIds: number[]) => {
    subjectTeacherMapping[subject] = newTeacherIds;
    mutate(subjects);
    toast.success(`Instructors for "${subject.replace(/-/g, ' ')}" updated.`);
  };

  const totalPages = subjects ? Math.ceil(subjects.length / itemsPerPage) : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
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
          <p className="text-muted-foreground">Could not find any subjects in the catalog.</p>
        </div>
      );
    }

    const paginatedSubjects = subjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedSubjects.map((subject) => {
          const meanGradeData = subjectScoreData[period].find(s => s.name === subject);
          const teacherIds = subjectTeacherMapping[subject] || [];
          const teachers = teacherIds.map(id => mockTeachers.find(t => t.id === id)).filter(Boolean) as Teacher[];

          return (
            <Card key={subject} className="glass-card flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="capitalize text-lg">{subject.replace(/-/g, ' ')}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(subject)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mean Grade ({period.replace(/_/g, ' ')})</p>
                  <p className="text-3xl font-bold text-primary">{meanGradeData?.averageScore.toFixed(1)}%</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Instructors</p>
                    <Button variant="outline" size="sm" onClick={() => handleManageInstructors(subject)}>
                        <Pencil className="h-3 w-3 mr-1.5" /> Manage
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {teachers.length > 0 ? (
                      teachers.map(teacher => (
                        <div key={teacher.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-1 -m-1 rounded-md" onClick={() => handleViewTeacher(teacher.id)}>
                          <TeacherAvatar teacherName={teacher.name} />
                          <span className="font-medium text-sm">{teacher.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No instructors assigned.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subjects Overview" description="View details for each subject offered.">
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter period" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="this_term">This Term</SelectItem>
            <SelectItem value="last_term">Last Term</SelectItem>
            <SelectItem value="full_year">Full Year</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>
      
      {renderContent()}

      {/* IMPROVEMENT: Added pagination controls */}
      {subjects && subjects.length > 0 && (
         <TablePaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={subjects.length}
            itemType="subjects"
            itemsPerPageOptions={[6, 9, 12, 15]}
         />
      )}
      
      {modalState.manageInstructors && modalState.subject && (
        <ManageInstructorsModal
          isOpen={modalState.manageInstructors}
          onOpenChange={(isOpen) => setModalState({ ...modalState, manageInstructors: isOpen })}
          subjectName={modalState.subject}
          allTeachers={mockTeachers}
          assignedTeacherIds={subjectTeacherMapping[modalState.subject] || []}
          onSave={(newIds) => handleSaveInstructors(modalState.subject!, newIds)}
        />
      )}

      {modalState.viewTeacher && modalState.teacher && (
        <UserPreviewModal 
          isOpen={modalState.viewTeacher}
          onOpenChange={(isOpen) => setModalState({ ...modalState, viewTeacher: isOpen, teacher: null })}
          user={modalState.teacher}
        />
      )}
    </div>
  );
}
