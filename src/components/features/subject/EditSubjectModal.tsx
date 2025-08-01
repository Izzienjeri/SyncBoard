"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subjectName: string;
  onSubjectUpdated: (oldName: string, newName: string) => Promise<void>;
}

export function EditSubjectModal({ isOpen, onOpenChange, subjectName, onSubjectUpdated }: EditSubjectModalProps) {
  const [newSubjectName, setNewSubjectName] = useState(subjectName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewSubjectName(subjectName);
    }
  }, [isOpen, subjectName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newSubjectName.trim() || newSubjectName === subjectName) {
      setError("Please enter a new name for the subject.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubjectUpdated(subjectName, newSubjectName);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>
            Rename the subject from <span className="font-semibold">{subjectName}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectName" className="text-right">New Name</Label>
            <Input id="subjectName" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="col-span-3" />
          </div>
          {error && <p className="text-sm text-destructive text-center col-span-4 pt-2">{error}</p>}
          <DialogFooter className="pt-6">
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