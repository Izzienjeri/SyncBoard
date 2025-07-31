"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, GripVertical, Eye } from "lucide-react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course.types";
import { CourseSchema } from "@/validators/course.schema";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

// Sortable Row Component for a Course
function SortableCourseRow({ course, onEdit, onDelete, onPreview, onInlineUpdate }: { course: Course; onEdit: (c: Course) => void; onDelete: (c: Course) => void; onPreview: (c: Course) => void; onInlineUpdate: (id: number, data: Partial<CourseSchema>) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 'auto' };

  const [editingCell, setEditingCell] = useState<{ field: "title" | "price"; value: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingCell]);

  const handleSave = () => {
    if (!editingCell) return;
    const { field, value } = editingCell;

    if (field === 'title' && value.trim() !== '' && value.trim() !== course.title) {
        onInlineUpdate(course.id, { title: value.trim() });
    } else if (field === 'price') {
      const newPrice = parseFloat(value);
      if (!isNaN(newPrice) && newPrice > 0 && newPrice !== course.price) {
        onInlineUpdate(course.id, { price: newPrice });
      }
    }
    setEditingCell(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditingCell(null);
  };

  const renderEditableCell = (field: "title" | "price") => {
    const isEditing = editingCell?.field === field;
    const value = field === 'title' ? course.title : course.price;

    return (
      <div onClick={() => !isDragging && !editingCell && setEditingCell({ field, value: String(value) })} className="cursor-pointer">
        {isEditing ? (
          <Input
            ref={inputRef} type={field === 'price' ? 'number' : 'text'} value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={handleSave} onKeyDown={handleKeyDown}
            className={cn("h-8 bg-transparent", field === 'price' && 'text-right')}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex items-center gap-2">
            {field === 'title' ? course.title : formatCurrency(course.price)}
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        )}
      </div>
    );
  };

  return (
    <tr ref={setNodeRef} style={style} className={cn("group bg-transparent hover:bg-muted/50 transition-colors", isDragging && "bg-primary/20 shadow-xl")}>
      <TableCell className="w-[50px] pl-2"><div {...attributes} {...listeners} className="cursor-grab py-4"><GripVertical className="h-5 w-5 text-muted-foreground" /></div></TableCell>
      <TableCell className="w-[80px]"><div className="relative h-12 w-12"><Image src={course.thumbnail} alt={course.title} fill sizes="48px" className="rounded-md object-cover" /></div></TableCell>
      <TableCell className="font-medium">{renderEditableCell('title')}</TableCell>
      <TableCell><Badge variant="secondary">{course.category}</Badge></TableCell>
      <TableCell className="text-right w-[120px]">{renderEditableCell('price')}</TableCell>
      <TableCell className="text-right w-[120px]">{course.stock} Slots</TableCell>
      <TableCell className="w-[50px]">
         <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onPreview(course)}><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(course)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(course)} className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </TableCell>
    </tr>
  );
}

export function CourseTable({ courses, onEdit, onDelete, onInlineUpdate }: { courses: Course[]; onEdit: (c: Course) => void; onDelete: (c: Course) => void; onInlineUpdate: (id: number, data: Partial<CourseSchema>) => void; }) {
  // A preview modal would be implemented here if needed
  const handlePreview = (course: Course) => {
      // Logic to open a preview modal
      console.log("Previewing course:", course)
  }

  return (
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"><span className="sr-only">Drag</span></TableHead>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right w-[120px]">Tuition</TableHead>
            <TableHead className="text-right w-[120px]">Slots</TableHead>
            <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={courses.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {courses.length > 0 ? (
              courses.map((course) => <SortableCourseRow key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} onPreview={handlePreview} onInlineUpdate={onInlineUpdate} />)
            ) : (
              <TableRow><TableCell colSpan={7} className="h-24 text-center">No courses to display.</TableCell></TableRow>
            )}
          </SortableContext>
        </TableBody>
      </Table>
    </div>
  );
}
