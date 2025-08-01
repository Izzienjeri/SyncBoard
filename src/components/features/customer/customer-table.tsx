"use client";

import { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";
import { Input } from "@/components/ui/input";
import { Pencil, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const SUBJECTS = ['mathematics', 'physics', 'history', 'english', 'computer-science', 'biology', 'chemistry'];
const GRADES = ['A', 'B', 'C', 'B', 'A', 'C', 'D', 'B', 'F'];

interface EditableCellProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditable?: boolean;
}

const EditableCell = ({ value, onSave, isEditable = true }: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(currentValue, 500);

  useEffect(() => {
    if (isEditing && debouncedValue !== value && debouncedValue.trim() !== '') {
      onSave(debouncedValue);
    }
  }, [debouncedValue, isEditing, value, onSave]);

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

  if (!isEditable) {
    return <span>{value}</span>;
  }

  return (
    <div onClick={() => !isEditing && setIsEditing(true)} className="cursor-pointer group">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 bg-transparent"
        />
      ) : (
        <span className="flex items-center gap-2">
          {value}
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      )}
    </div>
  );
};


interface CustomerTableProps {
  customers: User[];
  type: 'student' | 'teacher';
  startIndex: number;
  onUserUpdate: (id: number, data: Partial<User>) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

export function CustomerTable({ customers, type, startIndex, onUserUpdate, onViewUser, onDeleteUser }: CustomerTableProps) {
  
  const getDerivedData = (user: User, field: string) => {
    switch(field) {
        case 'grade': return GRADES[user.id % GRADES.length];
        case 'subject': return SUBJECTS[user.id % SUBJECTS.length].replace(/-/g, ' ');
        case 'meanGrade': return `${(user.id % 35) + 60}.0%`;
        default: return '';
    }
  }

  const handleDerivedDataSave = () => {
      toast.info("This field is derived and cannot be edited directly.", {
          description: "Changes to this field are for demonstration only."
      })
  }

  return (
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {type === 'student' && <TableHead>Grade</TableHead>}
              {type === 'teacher' && <TableHead>Subject</TableHead>}
              {type === 'teacher' && <TableHead>Mean Grade</TableHead>}
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((user, index) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground">{startIndex + index + 1}</TableCell>
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
                 {type === 'student' && <TableCell><EditableCell value={getDerivedData(user, 'grade')} onSave={handleDerivedDataSave} /></TableCell>}
                 {type === 'teacher' && <TableCell className="capitalize"><EditableCell value={getDerivedData(user, 'subject')} onSave={handleDerivedDataSave} /></TableCell>}
                 {type === 'teacher' && <TableCell><EditableCell value={getDerivedData(user, 'meanGrade')} onSave={handleDerivedDataSave} /></TableCell>}
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
                        <DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="text-destructive focus:text-destructive">
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
  );
}
