"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppUser } from "@/lib/fake-generators";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  users: AppUser[];
  type: 'student' | 'teacher';
  onDelete: (user: AppUser) => void;
  onEdit: (user: AppUser) => void;
}

export function UserTable({ users, type, onDelete, onEdit }: UserTableProps) {
  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow className="border-b hover:bg-transparent">
          <TableHead className="w-[70px] px-3 py-2 font-semibold text-foreground">ID</TableHead>
          <TableHead className="min-w-[250px] px-3 py-2 font-semibold text-foreground">Name</TableHead>
          <TableHead className="px-3 py-2 font-semibold text-foreground">Email</TableHead>
          <TableHead className="px-3 py-2 font-semibold text-foreground">Phone</TableHead>
          {type === 'student' && <TableHead className="w-[120px] px-3 py-2 font-semibold text-foreground">Grade</TableHead>}
          {type === 'teacher' && <TableHead className="px-3 py-2 font-semibold text-foreground">Subject</TableHead>}
          <TableHead className="w-[120px] px-3 py-2 text-right font-semibold text-foreground">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="hover:bg-muted/50">
            <TableCell className="px-3 py-2 text-muted-foreground">{user.id}</TableCell>
            <TableCell className="px-3 py-2 font-medium text-foreground">
              {`${user.firstName} ${user.lastName}`}
            </TableCell>
            <TableCell className="px-3 py-2">{user.email}</TableCell>
            <TableCell className="px-3 py-2">{user.phone}</TableCell>
            
            {/* TYPE-SAFE: No more casting! TypeScript understands the properties based on user.type */}
            {user.type === 'student' && (
              <TableCell className="px-3 py-2 font-medium text-center">
                {user.grade}
              </TableCell>
            )}
            {user.type === 'teacher' && (
              <TableCell className="capitalize px-3 py-2">
                {user.subject}
              </TableCell>
            )}

            <TableCell className="text-right px-3 py-2">
              <div className="flex justify-end gap-2">
                <Button onClick={() => onEdit(user)} variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDelete(user)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
