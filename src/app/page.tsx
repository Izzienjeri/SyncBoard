
"use client";

import { useState, useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductTable } from "@/components/features/product/product-table";
import { ProductTableSkeleton } from "@/components/features/product/product-table-skeleton";
import { ProductFormModal } from "@/components/features/product/product-form-modal";
import { getProducts } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Product } from "@/types/product.types";

export default function DashboardPage() {
  const { data: products, error, isLoading } = useSWR("/products", getProducts);
  const { mutate } = useSWRConfig();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const [key, order] = sortBy.split("-");
    const sorted = [...filtered].sort((a, b) => {
      let valA, valB;

      if (key === 'price') {
        valA = a.price;
        valB = b.price;
      } else {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [products, debouncedSearchTerm, sortBy]);

  const handleOpenCreateModal = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  const handleSuccess = () => {
    mutate("/products");
  };

  const renderContent = () => {
    if (isLoading) {
      return <ProductTableSkeleton />;
    }
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }
    if (!filteredAndSortedProducts || filteredAndSortedProducts.length === 0) {
      return (
        <div className="text-center py-10 border rounded-md">
          <h3 className="text-xl font-medium">No Products Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new product.
          </p>
        </div>
      );
    }
    return <ProductTable products={filteredAndSortedProducts} onEdit={handleOpenEditModal} />;
  };

  return (
    <>
      <main className="container py-8">
        <div className="flex justify-between items-start gap-4 mb-6">
          <PageHeader
            title="Products"
            description="View, filter, and manage your product inventory."
          />
          <Button onClick={handleOpenCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">{renderContent()}</div>
      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={editingProduct}
        onSuccess={handleSuccess}
      />
    </>
  );
}