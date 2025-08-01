"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/lib/fake-generators";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface AddSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubjectAdded: (data: { newSubjectName: string; teacherIds: number[] }) => Promise<void>;
  allTeachers: Teacher[];
}

export function AddSubjectModal({ isOpen, onOpenChange, onSubjectAdded, allTeachers }: AddSubjectModalProps) {
  const [subjectName, setSubjectName] = useState("");
  const [selectedTeacherIds, setSelectedTeacherIds] = useState(new Set<number>());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleTeacher = (teacherId: number) => {
    setSelectedTeacherIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teacherId)) {
        newSet.delete(teacherId);
      } else {
        newSet.add(teacherId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!subjectName.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubjectAdded({
        newSubjectName: subjectName,
        teacherIds: Array.from(selectedTeacherIds)
      });
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
      if (!open) {
          setSubjectName("");
          setSelectedTeacherIds(new Set());
          setError(null);
          setIsSubmitting(false);
      }
      onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Enter the name for the new subject and optionally assign instructors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input id="subjectName" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="mt-2" />
          </div>

          <div>
            <Label>Assign Instructors ({selectedTeacherIds.size} selected)</Label>
            <ScrollArea className="h-48 mt-2 border rounded-md p-4">
              <div className="space-y-3">
                {allTeachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`add-teacher-${teacher.id}`}
                      checked={selectedTeacherIds.has(teacher.id)}
                      onCheckedChange={() => handleToggleTeacher(teacher.id)}
                    />
                    <Label htmlFor={`add-teacher-${teacher.id}`} className="font-normal">{teacher.firstName} {teacher.lastName}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="button-gradient" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
