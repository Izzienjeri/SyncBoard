"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/lib/fake-generators";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subjectName: string;
  allTeachers: Teacher[];
  assignedTeacherIds: number[];
  onSubjectUpdate: (oldName: string, data: { newSubjectName: string, teacherIds: number[] }) => Promise<void>;
}

export function EditSubjectModal({ isOpen, onOpenChange, subjectName, allTeachers, assignedTeacherIds, onSubjectUpdate }: EditSubjectModalProps) {
  const [newName, setNewName] = useState(subjectName);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState(new Set(assignedTeacherIds));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewName(subjectName);
      setSelectedTeacherIds(new Set(assignedTeacherIds));
      setError(null);
    }
  }, [isOpen, subjectName, assignedTeacherIds]);

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
    if (!newName.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubjectUpdate(subjectName, {
        newSubjectName: newName,
        teacherIds: Array.from(selectedTeacherIds)
      });
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>Update the subject details and assign instructors.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input id="subjectName" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label>Assign Instructors ({selectedTeacherIds.size} selected)</Label>
            <ScrollArea className="h-48 mt-2 border rounded-md p-4">
              <div className="space-y-3">
                {allTeachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`teacher-${teacher.id}`}
                      checked={selectedTeacherIds.has(teacher.id)}
                      onCheckedChange={() => handleToggleTeacher(teacher.id)}
                    />
                    <Label htmlFor={`teacher-${teacher.id}`} className="font-normal">{teacher.firstName} {teacher.lastName}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="button-gradient" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}