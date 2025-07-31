"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseTable } from "@/components/features/course/course-table";
import { CourseTableSkeleton } from "@/components/features/course/course-table-skeleton";
import { CourseFormModal } from "@/components/features/course/course-form-modal";
import { getCourses, deleteCourse, updateCourse } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Course } from "@/types/course.types";
import { CourseSchema } from "@/validators/course.schema";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function CoursesPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | undefined>(undefined);

  const [displayCourses, setDisplayCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: courses, error, isLoading, mutate } = useSWR("https://dummyjson.com/products", getCourses);

  useEffect(() => {
    if (courses) {
      setDisplayCourses(courses);
    }
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    if (!displayCourses) return [];

    let processed = [...displayCourses];
    if (debouncedSearchTerm) {
      processed = processed.filter((course) =>
        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (sortBy !== "custom") {
      const [key, order] = sortBy.split("-");
      processed.sort((a, b) => {
        const valA = key === "price" ? a.price : a.title.toLowerCase();
        const valB = key === "price" ? b.price : b.title.toLowerCase();
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return processed;
  }, [displayCourses, debouncedSearchTerm, sortBy]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedCourses, currentPage]);

  const handleSuccess = () => mutate();

  const handleOpenCreateModal = () => {
    setEditingCourse(undefined);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteAlert = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete || !courses) return;
    const optimisticData = courses.filter((p) => p.id !== courseToDelete.id);
    mutate(optimisticData, { revalidate: false });
    try {
      await deleteCourse(courseToDelete.id);
      toast.success(`Course "${courseToDelete.title}" deleted.`);
    } catch {
      toast.error("Failed to delete course. Restoring data.");
      mutate(courses, { revalidate: true });
    } finally {
      setIsDeleteAlertOpen(false);
      setCourseToDelete(undefined);
    }
  };

  const handleInlineUpdate = async (courseId: number, data: Partial<CourseSchema>) => {
    const originalCourses = [...displayCourses];
    const updatedCourses = displayCourses.map((p) => (p.id === courseId ? { ...p, ...data } : p));
    setDisplayCourses(updatedCourses);

    try {
      await updateCourse(courseId, data);
      toast.success("Course updated successfully!");
      mutate(updatedCourses, { revalidate: false });
    } catch {
      toast.error("Failed to update course.");
      setDisplayCourses(originalCourses);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDisplayCourses((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setSortBy("custom");
      setCurrentPage(1);
    }
  };
  
  const renderContent = () => {
    if (isLoading) return <CourseTableSkeleton />;
    if (error) return (
      <Alert variant="destructive" className="glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load courses. Please try again.</AlertDescription>
      </Alert>
    );
    if (paginatedCourses.length === 0 && debouncedSearchTerm) return (
      <div className="text-center py-10 glass-card rounded-lg">
        <h3 className="text-xl font-medium">No Courses Found</h3>
        <p className="text-muted-foreground">Your search for &quot;{debouncedSearchTerm}&quot; did not match any courses.</p>
      </div>
    );
    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <CourseTable courses={paginatedCourses} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteAlert} onInlineUpdate={handleInlineUpdate} />
      </DndContext>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader title="Course Management" description="Manage your course catalog." />
        <div className="flex justify-end">
             <Button onClick={handleOpenCreateModal} className="button-gradient"><PlusCircle className="mr-2 h-4 w-4" />Add Course</Button>
        </div>
        <div className="p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 glass-card">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by course title..." className="pl-10 bg-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[220px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="custom" disabled={sortBy !== "custom"}>Custom Order</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-6">
          {renderContent()}
          {filteredAndSortedCourses.length > ITEMS_PER_PAGE && (
            <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE)} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
      <CourseFormModal isOpen={isFormModalOpen} onOpenChange={setIsFormModalOpen} course={editingCourse} onSuccess={handleSuccess} />
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-card/90 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete &quot;{courseToDelete?.title}&quot;.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}