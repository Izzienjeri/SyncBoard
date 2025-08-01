"use client";

import { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

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
      setCurrentValue(value); // Reset if empty or unchanged
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
}

export function CustomerTable({ customers, type, startIndex, onUserUpdate }: CustomerTableProps) {
  
  const getDerivedData = (user: User, field: string) => {
    switch(field) {
        case 'grade': return GRADES[user.id % GRADES.length];
        case 'subject': return SUBJECTS[user.id % SUBJECTS.length].replace(/-/g, ' ');
        case 'meanGrade': return `${(user.id % 35) + 60}.0`; // e.g. 60.0 - 94.0
        default: return '';
    }
  }

  return (
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Parent Phone</TableHead>
              {type === 'student' && <TableHead>This Term's Grade</TableHead>}
              {type === 'teacher' && <TableHead>Subject</TableHead>}
              {type === 'teacher' && <TableHead>Mean Grade</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((user, index) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>{startIndex + index + 1}</TableCell>
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
                 {type === 'student' && <TableCell>{getDerivedData(user, 'grade')}</TableCell>}
                 {type === 'teacher' && <TableCell className="capitalize">{getDerivedData(user, 'subject')}</TableCell>}
                 {type === 'teacher' && <TableCell>{getDerivedData(user, 'meanGrade')}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
