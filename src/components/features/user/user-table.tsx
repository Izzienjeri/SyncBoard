"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";
import { Eye, Trash2, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SUBJECTS = ['mathematics', 'physics', 'history', 'english', 'computer-science', 'biology', 'chemistry'];
const GRADES = ['A', 'B', 'C', 'B', 'A', 'C', 'D', 'B', 'F'];

const DerivedCell = ({ value, className }: { value: string, className?: string }) => (
    <span className={cn("text-muted-foreground", className)}>{value}</span>
);

interface UserTableProps {
  users: User[];
  type: 'student' | 'teacher';
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({ users, type, onViewUser, onEditUser, onDeleteUser }: UserTableProps) {
  
  // This function remains for demo purposes to enrich the UI.
  const getDerivedData = (user: User, field: string) => {
    switch(field) {
        case 'grade': return GRADES[user.id % GRADES.length];
        case 'subject': return SUBJECTS[user.id % SUBJECTS.length].replace(/-/g, ' ');
        case 'meanGrade': return `${(user.id % 35) + 60}.0%`;
        default: return '';
    }
  }

  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow className="border-b hover:bg-transparent">
          <TableHead className="w-[70px] px-3 py-2 font-semibold text-foreground">User ID</TableHead>
          <TableHead className="px-3 py-2 font-semibold text-foreground">Name</TableHead>
          <TableHead className="px-3 py-2 font-semibold text-foreground">Email</TableHead>
          <TableHead className="px-3 py-2 font-semibold text-foreground">Phone</TableHead>
          {type === 'student' && <TableHead className="px-3 py-2 font-semibold text-foreground">Grade</TableHead>}
          {type === 'teacher' && <TableHead className="px-3 py-2 font-semibold text-foreground">Subject</TableHead>}
          {type === 'teacher' && <TableHead className="px-3 py-2 font-semibold text-foreground">Mean Grade</TableHead>}
          <TableHead className="w-[50px] px-3 py-2 text-right font-semibold text-foreground">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="hover:bg-muted/50">
            <TableCell className="px-3 py-2 text-muted-foreground">{user.id}</TableCell>
            <TableCell className="px-3 py-2 font-medium text-foreground">{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell className="px-3 py-2">{user.email}</TableCell>
            <TableCell className="px-3 py-2">{user.phone}</TableCell>
            {type === 'student' && <TableCell className="px-3 py-2"><DerivedCell value={getDerivedData(user, 'grade')} /></TableCell>}
            {type === 'teacher' && <TableCell className="capitalize px-3 py-2"><DerivedCell value={getDerivedData(user, 'subject')} /></TableCell>}
            {type === 'teacher' && <TableCell className="px-3 py-2"><DerivedCell value={getDerivedData(user, 'meanGrade')} /></TableCell>}
            <TableCell className="text-right px-3 py-2">
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
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteUser(user)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}