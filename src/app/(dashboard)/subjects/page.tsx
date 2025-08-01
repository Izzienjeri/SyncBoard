"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import { AlertTriangle, Pencil, PlusCircle, Trash2, Eye, Search } from "lucide-react";
import { addSubject, getSubjects, getAllTeachers, updateSubject, deleteSubject } from "@/lib/api";
import { Teacher } from "@/lib/fake-generators";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TablePaginationControls } from "@/components/shared/table-pagination-controls";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { SubjectDetailsModal } from "@/components/features/subject/SubjectDetailsModal";
import { SubjectFormModal } from "@/components/features/subject/SubjectFormModal";
import { Input } from "@/components/ui/input";
import { SubjectFormValues } from "@/lib/schemas";

type SubjectDetails = {
  name: string;
  teachers: Teacher[];
  studentCount: number;
  avgGrade: number;
}

const TeacherAvatar = ({ teacher }: { teacher: Teacher }) => (
  <div className="group relative" title={`${teacher.firstName} ${teacher.lastName}`}>
    <Image
      src={teacher.image}
      alt={teacher.firstName}
      width={32}
      height={32}
      className="rounded-full border-2 border-card transition-transform group-hover:scale-110"
    />
  </div>
);

export default function SubjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  
  const [modalState, setModalState] = useState<{
    formOpen: boolean;
    editingSubjectName: string | null;
    delete: string | null;
    view: SubjectDetails | null;
  }>({ formOpen: false, editingSubjectName: null, delete: null, view: null });

  const { data: subjects, error: subjectsError, isLoading: subjectsLoading, mutate: mutateSubjects } = useSWR("/api/subjects", getSubjects);
  const { data: allTeachers, isLoading: teachersLoading, mutate: mutateTeachers } = useSWR("/api/teachers/all", getAllTeachers);

  const subjectDetailsMap = useMemo(() => {
    const map = new Map<string, SubjectDetails>();
    if (subjects && allTeachers) {
      subjects.forEach((subject: string) => {
        map.set(subject, {
          name: subject,
          teachers: allTeachers.filter((t: Teacher) => t.subject === subject),
          studentCount: Math.floor(Math.random() * 80) + 20,
          avgGrade: Math.random() * (95 - 70) + 70,
        });
      });
    }
    return map;
  }, [subjects, allTeachers]);

  const sortedSubjects = useMemo(() => {
    if (!subjects) return [];
    
    const subjectsToProcess = subjects.filter(subject => 
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [sortBy, sortOrder] = sortOption.split('-');

    subjectsToProcess.sort((a, b) => {
        const detailsA = subjectDetailsMap.get(a);
        const detailsB = subjectDetailsMap.get(b);
        if (!detailsA || !detailsB) return 0;

        let comparison = 0;
        switch (sortBy) {
            case 'students':
                comparison = detailsA.studentCount - detailsB.studentCount;
                break;
            case 'grade':
                comparison = detailsA.avgGrade - detailsB.avgGrade;
                break;
            case 'name':
            default:
                comparison = a.localeCompare(b);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return subjectsToProcess;
  }, [subjects, searchQuery, sortOption, subjectDetailsMap]);

  const handleSubjectSubmit = async (data: SubjectFormValues) => {
    try {
      if (modalState.editingSubjectName) {
        await updateSubject(modalState.editingSubjectName, { newSubjectName: data.name, teacherIds: data.teacherIds });
        toast.success(`Subject "${data.name}" updated successfully.`);
      } else {
        const newSubject = await addSubject({ subjectName: data.name, teacherIds: data.teacherIds });
        toast.success(`Subject "${newSubject.name}" added successfully.`);
      }
      await Promise.all([mutateSubjects(), mutateTeachers()]);
    } catch (e: unknown) {
      if (e instanceof Error) toast.error(e.message);
      throw e;
    }
  };
  
  const handleDeleteSubject = async (subjectName: string) => {
    try {
      await deleteSubject(subjectName);
      toast.success(`Subject "${subjectName}" deleted.`);
      await mutateSubjects();
    } catch(e: unknown) {
      if (e instanceof Error) toast.error(e.message);
    }
  };

  const totalPages = sortedSubjects ? Math.ceil(sortedSubjects.length / itemsPerPage) : 0;

  const renderContent = () => {
    if (subjectsLoading || teachersLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      );
    }
    if (subjectsError) return ( <Alert variant="destructive" className="glass-card"><AlertTriangle className="h-4 w-4" /> <AlertTitle>Error</AlertTitle><AlertDescription>Failed to load subjects. Please try again.</AlertDescription></Alert> );
    if (!sortedSubjects || sortedSubjects.length === 0) return ( <div className="text-center py-10 glass-card rounded-lg"><h3 className="text-xl font-medium">No Subjects Found</h3><p className="text-muted-foreground">{searchQuery ? "Try a different search term." : "Click \"Add Subject\" to get started."}</p></div> );
    
    const paginatedSubjects = sortedSubjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedSubjects.map((subjectName) => {
          const details = subjectDetailsMap.get(subjectName);
          if (!details) return null;
          
          return (
            <Card key={details.name} className="glass-card flex flex-col justify-between rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 group cursor-pointer"
              onClick={() => setModalState({...modalState, view: details})}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="capitalize text-lg font-bold text-foreground">{details.name}</CardTitle>
                  <div className="flex items-center -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({...modalState, view: details})}> <Eye className="h-4 w-4" /> </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({...modalState, editingSubjectName: details.name, formOpen: true})}> <Pencil className="h-4 w-4" /> </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setModalState({...modalState, delete: details.name})}> <Trash2 className="h-4 w-4" /> </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Students</p><p className="font-semibold text-xl">{details.studentCount}</p></div>
                <div><p className="text-muted-foreground">Avg. Grade</p><p className="font-semibold text-xl">{details.avgGrade.toFixed(1)}%</p></div>
              </CardContent>
              <CardFooter className="pt-4">
                <div className="w-full">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">INSTRUCTORS ({details.teachers.length})</p>
                  {details.teachers.length > 0 ? (<div className="flex -space-x-2">{details.teachers.slice(0, 6).map(teacher => <TeacherAvatar key={teacher.id} teacher={teacher} />)}</div>) : (<p className="text-xs text-muted-foreground italic">No instructors assigned.</p>)}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  const formInitialData = useMemo(() => {
    if (!modalState.editingSubjectName || !allTeachers) return null;
    const assignedTeacherIds = allTeachers.filter(t => t.subject === modalState.editingSubjectName).map(t => t.id);
    return { name: modalState.editingSubjectName, teacherIds: assignedTeacherIds };
  }, [modalState.editingSubjectName, allTeachers]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subjects Overview" description="View and manage all subjects offered.">
        <Button onClick={() => setModalState({...modalState, editingSubjectName: null, formOpen: true})} className="button-gradient">
          <PlusCircle className="h-4 w-4 mr-2"/> Add Subject
        </Button>
      </PageHeader>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search subjects..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="pl-9"/></div>
        <Select value={sortOption} onValueChange={setSortOption}><SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Sort by..." /></SelectTrigger><SelectContent><SelectItem value="name-asc">Name (A-Z)</SelectItem><SelectItem value="name-desc">Name (Z-A)</SelectItem><SelectItem value="students-desc">Most Students</SelectItem><SelectItem value="students-asc">Fewest Students</SelectItem><SelectItem value="grade-desc">Highest Grade</SelectItem><SelectItem value="grade-asc">Lowest Grade</SelectItem></SelectContent></Select>
      </div>

      {renderContent()}
      
      {sortedSubjects && sortedSubjects.length > 0 && (
        <TablePaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} onItemsPerPageChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }} totalItems={sortedSubjects.length} itemType="subjects" itemsPerPageOptions={[6, 9, 12, 18]} />
      )}
      
      <ConfirmationDialog isOpen={!!modalState.delete} onOpenChange={(isOpen) => !isOpen && setModalState({...modalState, delete: null})} onConfirm={() => { if (modalState.delete) handleDeleteSubject(modalState.delete); }} title="Are you sure?" description={`This will permanently delete the subject "${modalState.delete}". This action cannot be undone.`} confirmText="Yes, delete" />
      
      {allTeachers && (
        <SubjectFormModal isOpen={modalState.formOpen} onOpenChange={(isOpen) => setModalState({ ...modalState, formOpen: isOpen })} onSubmit={handleSubjectSubmit} allTeachers={allTeachers} initialData={formInitialData} />
      )}

      <SubjectDetailsModal isOpen={!!modalState.view} onOpenChange={(isOpen) => !isOpen && setModalState({...modalState, view: null})} subjectDetails={modalState.view} />
    </div>
  );
}
