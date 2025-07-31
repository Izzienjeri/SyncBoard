
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product.types";
import { ProductSchema, productSchema } from "@/validators/product.schema";
import { createProduct, updateProduct } from "@/lib/api";

interface ProductFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product?: Product;
  onSuccess: () => void;
}

const defaultValues: ProductSchema = {
  title: "",
  description: "",
  price: 0,
  stock: 0,
};

export function ProductFormModal({
  isOpen,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const isEditMode = !!product;

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditMode ? product : defaultValues,
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset(isEditMode ? product : defaultValues);
    }
  }, [isOpen, product, isEditMode, reset]);

  async function onSubmit(data: ProductSchema) {
    try {
      if (isEditMode) {
        await updateProduct(product.id, data);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data);
        toast.success("Product created successfully!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to the product details."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. iPhone 15 Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="999.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}