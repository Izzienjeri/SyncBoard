"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AppUser } from "@/lib/schemas";
import { Trash2, Pencil, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
          <TableHead className="min-w-[150px] px-3 py-2 font-semibold text-foreground">Name</TableHead>
          <TableHead className="hidden sm:table-cell px-3 py-2 font-semibold text-foreground">Email</TableHead>
          <TableHead className="hidden md:table-cell px-3 py-2 font-semibold text-foreground">Phone</TableHead>
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
            <TableCell className="hidden sm:table-cell px-3 py-2">{user.email}</TableCell>
            <TableCell className="hidden md:table-cell px-3 py-2">{user.phone}</TableCell>
            
            {/* TYPE-SAFE: No more casting! TypeScript understands the properties based on user.type */}
            {user.type === 'student' && (
              <TableCell className="px-3 py-2 text-center">
                <Badge className={cn(
                  "font-semibold",
                  {
                    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300": user.grade === 'A',
                    "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300": user.grade === 'B',
                    "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300": user.grade === 'C',
                    "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300": user.grade === 'D',
                    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300": user.grade === 'F',
                  }
                )}>
                  {user.grade}
                </Badge>
              </TableCell>
            )}
            {user.type === 'teacher' && (
              <TableCell className="capitalize px-3 py-2">
                {user.subject}
              </TableCell>
            )}

            <TableCell className="text-right px-3 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
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
