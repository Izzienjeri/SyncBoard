"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubjectAdded: (newSubjectName: string) => Promise<void>;
}

export function AddSubjectModal({ isOpen, onOpenChange, onSubjectAdded }: AddSubjectModalProps) {
  const [subjectName, setSubjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!subjectName.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubjectAdded(subjectName);
      onOpenChange(false);
      setTimeout(() => setSubjectName(""), 300);
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
            Enter the name for the new subject.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectName" className="text-right">Name</Label>
            <Input id="subjectName" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="col-span-3" />
          </div>
          {error && <p className="text-sm text-destructive text-center col-span-4 pt-2">{error}</p>}
          <DialogFooter className="pt-6">
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