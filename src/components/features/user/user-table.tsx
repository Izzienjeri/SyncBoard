"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";
import { Student, Teacher } from "@/lib/fake-generators";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserTableProps {
  users: User[];
  type: 'student' | 'teacher';
  onDeleteUser: (user: User) => void;
  // Inline editing props
  editingUserId: number | null;
  editedUserData: Partial<User & Student & Teacher>;
  onStartEdit: (user: User) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userId: number) => Promise<void>;
  onEditDataChange: (field: keyof (User & Student & Teacher), value: string) => void;
  allSubjects?: string[];
}

const gradeOptions = ['A', 'B', 'C', 'D', 'F'];

export function UserTable({
  users,
  type,
  onDeleteUser,
  editingUserId,
  editedUserData,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditDataChange,
  allSubjects = [],
}: UserTableProps) {
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
        {users.map((user) => {
          const isEditing = editingUserId === user.id;

          return (
            <TableRow key={user.id} className={isEditing ? "bg-secondary" : "hover:bg-muted/50"}>
              <TableCell className="px-3 py-1 text-muted-foreground">{user.id}</TableCell>
              <TableCell className="px-3 py-1 font-medium text-foreground">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input placeholder="First Name" value={editedUserData.firstName || ''} onChange={(e) => onEditDataChange('firstName', e.target.value)} />
                    <Input placeholder="Last Name" value={editedUserData.lastName || ''} onChange={(e) => onEditDataChange('lastName', e.target.value)} />
                  </div>
                ) : (
                  `${user.firstName} ${user.lastName}`
                )}
              </TableCell>
              <TableCell className="px-3 py-1">
                {isEditing ? <Input type="email" placeholder="Email" value={editedUserData.email || ''} onChange={(e) => onEditDataChange('email', e.target.value)} /> : user.email}
              </TableCell>
              <TableCell className="px-3 py-1">
                {isEditing ? <Input placeholder="Phone" value={editedUserData.phone || ''} onChange={(e) => onEditDataChange('phone', e.target.value)} /> : user.phone}
              </TableCell>
              
              {type === 'student' && (
                <TableCell className="px-3 py-1 font-medium text-center">
                  {isEditing ? (
                    <Select value={(editedUserData as Student).grade} onValueChange={(value) => onEditDataChange('grade', value)}>
                      <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    (user as Student).grade
                  )}
                </TableCell>
              )}
              {type === 'teacher' && (
                <TableCell className="capitalize px-3 py-1">
                  {isEditing ? (
                     <Select value={(editedUserData as Teacher).subject} onValueChange={(value) => onEditDataChange('subject', value)}>
                      <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                      <SelectContent>
                        {allSubjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    (user as Teacher).subject
                  )}
                </TableCell>
              )}

              <TableCell className="text-right px-3 py-1">
                {isEditing ? (
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onSaveEdit(user.id)} size="icon" className="h-8 w-8 bg-green-500 hover:bg-green-600">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button onClick={onCancelEdit} variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onStartEdit(user)} variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => onDeleteUser(user)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
