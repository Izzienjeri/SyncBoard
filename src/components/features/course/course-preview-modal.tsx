"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course.types";
import { formatCurrency } from "@/lib/utils";

interface CoursePreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  course?: Course;
}

export function CoursePreviewModal({ isOpen, onOpenChange, course }: CoursePreviewModalProps) {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative h-[150px] w-[150px] p-1 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  sizes="150px"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">{course.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Rating: {course.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-3xl font-light">{formatCurrency(course.price)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Description</h4>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
