"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Teacher } from "@/lib/fake-generators";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subjectDetails: {
    name: string;
    teachers: Teacher[];
    studentCount: number;
    avgGrade: number;
  } | null;
}

export function SubjectDetailsModal({ isOpen, onOpenChange, subjectDetails }: SubjectDetailsModalProps) {
  if (!subjectDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{subjectDetails.name}</DialogTitle>
          <DialogDescription>
            An overview of the subject and its instructors.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
            <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Students Enrolled</span>
                <span className="font-semibold text-lg">{subjectDetails.studentCount}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Average Grade</span>
                <Badge variant="secondary" className="w-fit text-base">{subjectDetails.avgGrade.toFixed(1)}%</Badge>
            </div>
        </div>
        <div>
            <h4 className="font-semibold mb-3">Instructors ({subjectDetails.teachers.length})</h4>
            <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
                {subjectDetails.teachers.length > 0 ? (
                    subjectDetails.teachers.map(teacher => (
                        <div key={teacher.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                            <Image src={teacher.image} alt={teacher.firstName} width={40} height={40} className="rounded-full" />
                            <div className="flex flex-col">
                                <span className="font-medium">{teacher.firstName} {teacher.lastName}</span>
                                <span className="text-xs text-muted-foreground">{teacher.email}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-8">No instructors are currently assigned to this subject.</p>
                )}
            </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}