// === components/features/subject/add-subject-modal.tsx ===
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubjectAdded: (newSubject: string) => void;
  addSubjectApi: (subjectName: string) => Promise<string>;
}

export function AddSubjectModal({ isOpen, onOpenChange, onSubjectAdded, addSubjectApi }: AddSubjectModalProps) {
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
      const newSubject = await addSubjectApi(subjectName);
      onSubjectAdded(newSubject);
      onOpenChange(false);
      setTimeout(() => setSubjectName(""), 300);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to add subject.");
      } else {
        setError("An unknown error occurred while adding the subject.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Enter the name for the new subject.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectName" className="text-right">Name</Label>
              <Input id="subjectName" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="col-span-3" />
            </div>
            {error && <p className="text-sm text-destructive text-center col-span-4">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="button-gradient" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}