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
};

export function ProductFormModal({
  isOpen,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const isEditMode = !!product;

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues:
      isEditMode && product
        ? {
            title: product.title,
            description: product.description || "",
            price: product.price,
          }
        : defaultValues,
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && product) {
        reset({
          title: product.title,
          description: product.description || "",
          price: product.price,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, product, isEditMode, reset]);

  const onSubmit = async (data: ProductSchema) => {
    try {
      if (isEditMode && product) {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </DialogTitle>
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
                    <Input placeholder="e.g. Classic T-Shirt" {...field} />
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
                    <Textarea
                      placeholder="Product description..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="19.99"
                      {...field}
                      value={field.value as number | string}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="button-gradient">
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
