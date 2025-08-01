"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Teacher } from "@/lib/fake-generators";
import { Checkbox } from "@/components/ui/checkbox";
import { subjectSchema, SubjectFormValues } from "@/lib/schemas";
import { toast } from "sonner";

interface SubjectFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: SubjectFormValues) => Promise<void>;
  allTeachers: Teacher[];
  initialData?: SubjectFormValues | null;
}

export function SubjectFormModal({ isOpen, onOpenChange, onSubmit, allTeachers, initialData }: SubjectFormModalProps) {
  const isEditMode = !!initialData;

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });
  
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (isOpen) {
      form.reset(isEditMode && initialData ? initialData : { name: "", teacherIds: [] });
    }
  }, [isOpen, isEditMode, initialData, form]);

  const handleSubmit = async (data: SubjectFormValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (err) {
       if (err instanceof Error) {
        toast.error(err.message || "An unknown error occurred.");
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Subject" : "Add New Subject"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the subject details and assign instructors." 
              : "Enter the name for the new subject and optionally assign instructors."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control} name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Computer Science" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control} name="teacherIds"
              render={() => (
                <FormItem>
                  <FormLabel>Assign Instructors ({form.watch('teacherIds')?.length || 0} selected)</FormLabel>
                  <div className="max-h-48 overflow-y-auto mt-2 border rounded-md p-4">
                    <div className="space-y-3">
                      {allTeachers.map((teacher) => (
                        <FormField
                           key={teacher.id} control={form.control} name="teacherIds"
                           render={({ field }) => (
                             <FormItem key={teacher.id} className="flex flex-row items-start space-x-3 space-y-0">
                               <FormControl>
                                 <Checkbox
                                   checked={field.value?.includes(teacher.id)}
                                   onCheckedChange={(checked) => {
                                     return checked
                                       ? field.onChange([...(field.value || []), teacher.id])
                                       : field.onChange(field.value?.filter((id) => id !== teacher.id));
                                   }}
                                 />
                               </FormControl>
                               <FormLabel className="font-normal">{`${teacher.firstName} ${teacher.lastName}`}</FormLabel>
                             </FormItem>
                           )}
                         />
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" className="button-gradient" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save Subject')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
