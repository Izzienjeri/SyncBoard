"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ManageInstructorsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subjectName: string;
  allTeachers: Teacher[];
  assignedTeacherIds: number[];
  onSave: (newTeacherIds: number[]) => void;
}

export function ManageInstructorsModal({
  isOpen,
  onOpenChange,
  subjectName,
  allTeachers,
  assignedTeacherIds,
  onSave,
}: ManageInstructorsModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(assignedTeacherIds));

  const handleToggle = (teacherId: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teacherId)) {
        newSet.delete(teacherId);
      } else {
        newSet.add(teacherId);
      }
      return newSet;
    });
  };

  const handleSaveChanges = () => {
    onSave(Array.from(selectedIds));
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Manage Instructors</DialogTitle>
          <DialogDescription>
            Assign or un-assign instructors for <span className="font-bold capitalize">{subjectName.replace(/-/g, ' ')}</span>.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80 pr-4">
          <div className="space-y-4 py-2">
            {allTeachers.map(teacher => (
              <div key={teacher.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`teacher-${teacher.id}`}
                  checked={selectedIds.has(teacher.id)}
                  onCheckedChange={() => handleToggle(teacher.id)}
                />
                <Label htmlFor={`teacher-${teacher.id}`} className="font-medium">
                  {teacher.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges} className="button-gradient">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
