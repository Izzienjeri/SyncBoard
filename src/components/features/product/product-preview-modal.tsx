"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product.types";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product?: Product;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleString() : 'N/A';

export function ProductPreviewModal({ isOpen, onOpenChange, product }: ProductPreviewModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative h-[150px] w-[150px] p-1 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="150px"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">{product.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Rating: {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
                </span>
              </div>
              <p className="text-3xl font-light">{formatCurrency(product.price)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Description</h4>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Audit Information</h4>
            <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
              <span>Created By:</span><span className="font-medium text-foreground">{product.createdBy}</span>
              <span>Created At:</span><span className="font-medium text-foreground">{formatDate(product.createdAt)}</span>
              <span>Updated By:</span><span className="font-medium text-foreground">{product.updatedBy || 'N/A'}</span>
              <span>Updated At:</span><span className="font-medium text-foreground">{formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
