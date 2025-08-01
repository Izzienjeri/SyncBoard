// components/features/user/user-table.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";
import { Input } from "@/components/ui/input";
import { Pencil, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner"; // REMOVE THIS LINE: 'toast' is unused
import { cn } from "@/lib/utils";

const GRADES = ['A', 'B', 'C', 'B', 'A', 'C', 'D', 'B', 'F'];

interface EditableCellProps {
  value: string;
  onSave: (newValue: string) => void;
}

const EditableCell = ({ value, onSave }: EditableCellProps) => {
  // ... (component implementation is correct, no changes needed here)
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
        <span onClick={() => setIsEditing(true)} className="cursor-text flex items-center gap-2">
          {value}
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      )}
    </div>
  );
};

interface DerivedCellProps {
    value: string;
    className?: string;
}

const DerivedCell = ({ value, className }: DerivedCellProps) => (
    <span className={cn("text-muted-foreground italic", className)}>{value}</span>
);

interface UserTableProps {
  users: User[];
  type: 'student' | 'teacher';
  // startIndex: number; // REMOVE THIS LINE: The prop is not used
  onUserUpdate: (id: number, data: Partial<User>) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

// REMOVE 'startIndex' from the destructured props
export function UserTable({ users, type, onUserUpdate, onViewUser, onDeleteUser }: UserTableProps) {
  
  const getDerivedData = (user: User, field: string) => {
    switch(field) {
        case 'grade': return GRADES[user.id % GRADES.length];
        // FIX THIS LINE: Safely access 'subject' without 'any'
        case 'subject': return user.subject?.replace(/-/g, ' ') || 'N/A';
        case 'meanGrade': return `${(user.id % 35) + 60}.0%`;
        default: return '';
    }
  }

  return (
    <div className="rounded-xl border bg-card backdrop-blur-xl overflow-hidden glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {type === 'student' && <TableHead>Grade</TableHead>}
              {type === 'teacher' && <TableHead>Primary Subject</TableHead>}
              {type === 'teacher' && <TableHead>Mean Grade</TableHead>}
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground font-mono text-xs">{user.id}</TableCell>
                <TableCell className="font-medium">
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
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete {type}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
