"use client";

import { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";
import { Input } from "@/components/ui/input";
import { Pencil, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SUBJECTS = ['mathematics', 'physics', 'history', 'english', 'computer-science', 'biology', 'chemistry'];
const GRADES = ['A', 'B', 'C', 'B', 'A', 'C', 'D', 'B', 'F'];

interface EditableCellProps {
  value: string;
  onSave: (newValue: string) => void;
}

const EditableCell = ({ value, onSave }: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentValue.trim() !== '' && currentValue !== value) {
      onSave(currentValue);
    } else {
      setCurrentValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className="group relative pr-4">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 bg-background"
        />
      ) : (
        <span onClick={() => setIsEditing(true)} className="cursor-pointer flex items-center gap-2">
          {value}
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      )}
    </div>
  );
};

const DerivedCell = ({ value, className }: { value: string, className?: string }) => (
    <span className={cn("text-muted-foreground", className)}>{value}</span>
);

interface UserTableProps {
  users: User[];
  type: 'student' | 'teacher';
  onUserUpdate: (id: number, data: Partial<User>) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

export function UserTable({ users, type, onUserUpdate, onViewUser, onDeleteUser }: UserTableProps) {
  
  const getDerivedData = (user: User, field: string) => {
    switch(field) {
        case 'grade': return GRADES[user.id % GRADES.length];
        case 'subject': return SUBJECTS[user.id % SUBJECTS.length].replace(/-/g, ' ');
        case 'meanGrade': return `${(user.id % 35) + 60}.0%`;
        default: return '';
    }
  }

  return (
    // FIX: This two-div structure is a robust way to handle overflow clipping within rounded borders.
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              {/* FIX: Header text style matches screenshot */}
              <TableHead className="w-[80px] font-semibold text-foreground">User ID</TableHead>
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Email</TableHead>
              <TableHead className="font-semibold text-foreground">Phone</TableHead>
              {type === 'student' && <TableHead className="font-semibold text-foreground">Grade</TableHead>}
              {type === 'teacher' && <TableHead className="font-semibold text-foreground">Subject</TableHead>}
              {type === 'teacher' && <TableHead className="font-semibold text-foreground">Mean Grade</TableHead>}
              <TableHead className="w-[50px] text-right font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                {/* FIX: Removed font-mono for a cleaner look */}
                <TableCell className="text-muted-foreground">{user.id}</TableCell>
                <TableCell className="font-medium text-foreground">
                  <EditableCell 
                    value={`${user.firstName} ${user.lastName}`} 
                    onSave={(newValue) => {
                        const [firstName, ...lastName] = newValue.split(' ');
                        onUserUpdate(user.id, { firstName, lastName: lastName.join(' ') });
                    }}
                  />
                </TableCell>
                <TableCell>
                    <EditableCell value={user.email} onSave={(newValue) => onUserUpdate(user.id, { email: newValue })} />
                </TableCell>
                <TableCell>
                  <EditableCell value={user.phone} onSave={(newValue) => onUserUpdate(user.id, { phone: newValue })} />
                </TableCell>
                  {type === 'student' && <TableCell><DerivedCell value={getDerivedData(user, 'grade')} /></TableCell>}
                  {type === 'teacher' && <TableCell className="capitalize"><DerivedCell value={getDerivedData(user, 'subject')} /></TableCell>}
                  {type === 'teacher' && <TableCell><DerivedCell value={getDerivedData(user, 'meanGrade')} /></TableCell>}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
