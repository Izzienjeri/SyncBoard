"use client";

import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/product.types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead className="text-right w-[100px]">Price</TableHead>
            <TableHead className="text-right w-[100px]">Stock</TableHead>
            <TableHead className="text-right w-[100px]">Rating</TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell className="text-muted-foreground">{product.brand}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell className="text-right">{product.rating.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40"
                      onClick={() => alert(`Delete action for ${product.title}`)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
