"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/types/course.types";
import { CourseSchema, courseSchema } from "@/validators/course.schema";
import { createCourse, updateCourse } from "@/lib/api";

interface CourseFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  course?: Course;
  onSuccess: () => void;
}

const defaultValues: CourseSchema = {
  title: "",
  description: "",
  price: 0,
};

export function CourseFormModal({ isOpen, onOpenChange, course, onSuccess }: CourseFormModalProps) {
  const isEditMode = !!course;

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues,
    mode: "onChange",
  });

  const { formState: { isSubmitting }, reset } = form;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && course) {
        reset({
          title: course.title,
          description: course.description || "",
          price: course.price,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, course, isEditMode, reset]);

  const onSubmit = async (data: CourseSchema): Promise<void> => {
    try {
      if (isEditMode && course) {
        await updateCourse(course.id, data);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(data);
        toast.success("Course created successfully!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Make changes to the course details." : "Fill in the details for a new course."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction to Physics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Course description..." 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuition Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="499.99"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="button-gradient">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Course"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}