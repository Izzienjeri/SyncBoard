"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormValues } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { AppUser } from "@/lib/fake-generators"; // Use AppUser

interface UserFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userType: 'student' | 'teacher';
  onSubmit: (data: UserFormValues) => Promise<void>;
  initialData?: AppUser | null; // Use AppUser
}

export function UserFormModal({ isOpen, onOpenChange, userType, onSubmit, initialData }: UserFormModalProps) {
  // ... rest of the component logic remains the same
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        form.reset({
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone || "",
        });
      } else {
        form.reset();
      }
    }
  }, [isOpen, isEditMode, initialData, form]);

  const handleFormSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit ${userType}` : `Add New ${userType}`}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the details for this ${userType}.` : `Enter the details for the new ${userType}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
              <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            </div>
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}> Cancel </Button>
              <Button type="submit" className="button-gradient" disabled={isSubmitting || !form.formState.isDirty}> {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : `Save ${userType}`)} </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
