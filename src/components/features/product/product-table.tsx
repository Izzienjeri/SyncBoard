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
import { Product } from "@/types/product.types";
import { ProductSchema } from "@/validators/product.schema";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

// Sortable Row Component
function SortableProductRow({ product, onEdit, onDelete, onPreview, onInlineUpdate }: { product: Product; onEdit: (p: Product) => void; onDelete: (p: Product) => void; onPreview: (p: Product) => void; onInlineUpdate: (id: number, data: Partial<ProductSchema>) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
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

    if (field === 'title') {
      const newTitle = value.trim();
      if (newTitle !== '' && newTitle !== product.title) {
        onInlineUpdate(product.id, { title: newTitle });
      }
    } else if (field === 'price') {
      const newPrice = parseFloat(value);
      if (!isNaN(newPrice) && newPrice > 0 && newPrice !== product.price) {
        onInlineUpdate(product.id, { price: newPrice });
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
    const value = field === 'title' ? product.title : product.price;

    return (
      <div onClick={() => !isDragging && !editingCell && setEditingCell({ field, value: String(value) })} className="cursor-pointer">
        {isEditing ? (
          <Input
            ref={inputRef}
            type={field === 'price' ? 'number' : 'text'}
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={cn("h-8 bg-transparent", field === 'price' && 'text-right')}
            onClick={(e) => e.stopPropagation()} // Prevent triggering the parent div's onClick
          />
        ) : (
          <span className="flex items-center gap-2">
            {field === 'title' ? product.title : formatCurrency(product.price)}
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        )}
      </div>
    );
  };

  return (
    <tr ref={setNodeRef} style={style} className={cn("group bg-transparent hover:bg-muted/50 transition-colors", isDragging && "bg-primary/20 shadow-xl shadow-primary/20 ring-2 ring-primary/50")}>
      {/* Desktop Table Cells (hidden on mobile) */}
      <TableCell className="hidden md:table-cell w-[50px] pl-2">
        <div {...attributes} {...listeners} className="cursor-grab py-4">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell w-[80px]">
        <div className="relative h-12 w-12">
          <Image src={product.image} alt={product.title} fill sizes="48px" className="rounded-md object-cover" />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell font-medium">{renderEditableCell('title')}</TableCell>
      <TableCell className="hidden md:table-cell"><Badge variant="secondary">{product.category}</Badge></TableCell>
      <TableCell className="hidden md:table-cell text-right w-[120px]">{renderEditableCell('price')}</TableCell>
      <TableCell className="hidden md:table-cell text-right w-[100px]">{product.rating.rate.toFixed(2)}</TableCell>
      <TableCell className="hidden md:table-cell w-[50px]">
         <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onPreview(product)}><Eye className="mr-2 h-4 w-4" />Quick View</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(product)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(product)} className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </TableCell>

      {/* Mobile Card Layout (inside a single cell, visible only on mobile) */}
      <TableCell className="md:hidden p-0" colSpan={7}>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                  <Image src={product.image} alt={product.title} fill sizes="64px" className="rounded-lg object-cover" />
              </div>
              <div>
                <div className="font-bold text-base mb-1">{renderEditableCell('title')}</div>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>
            <div {...attributes} {...listeners} className="cursor-grab p-2">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="font-medium text-lg">{renderEditableCell('price')}</div>
            <div className="text-muted-foreground">Rating: {product.rating.rate.toFixed(2)}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onPreview(product)}><Eye className="mr-2 h-4 w-4" />Quick View</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onEdit(product)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDelete(product)} className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </TableCell>
    </tr>
  );
}

// Main Table Component (Simplified)
export function ProductTable({ products, ...props }: { products: Product[]; onEdit: (p: Product) => void; onDelete: (p: Product) => void; onPreview: (p: Product) => void; onInlineUpdate: (id: number, data: Partial<ProductSchema>) => void; }) {
  return (
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
      <Table>
        <TableHeader>
          {/* These headers will be hidden on mobile by the responsive nature of the cells below */}
          <TableRow>
            <TableHead className="hidden md:table-cell w-[50px]"><span className="sr-only">Drag Handle</span></TableHead>
            <TableHead className="hidden md:table-cell w-[80px]">Image</TableHead>
            <TableHead className="hidden md:table-cell">Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell text-right w-[120px]">Price</TableHead>
            <TableHead className="hidden md:table-cell text-right w-[100px]">Rating</TableHead>
            <TableHead className="hidden md:table-cell w-[50px]"><span className="sr-only">Actions</span></TableHead>
            {/* A dummy header for mobile view to prevent layout shifts, but it has no content */}
            <TableHead className="md:hidden"><span className="sr-only">Product</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {products.length > 0 ? (
              products.map((product) => <SortableProductRow key={product.id} product={product} {...props} />)
            ) : (
              <TableRow><TableCell colSpan={7} className="h-24 text-center">No products to display.</TableCell></TableRow>
            )}
          </SortableContext>
        </TableBody>
      </Table>
    </div>
  );
}
