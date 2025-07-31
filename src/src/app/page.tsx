// src/app/page.tsx

"use client";

import { useState, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { AlertTriangle, PlusCircle, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { getProducts, deleteProduct } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Product } from "@/types/product.types";

const PAGE_SIZE = 10;

export default function DashboardPage() {
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | undefined>(undefined);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // SWR hook for infinite loading (pagination)
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.products.length) return null; // Reached the end
    const skip = pageIndex * PAGE_SIZE;
    return `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`;
  };

  const {
    data,
    error,
    size,
    setSize,
    mutate,
    isLoading: isLoadingInitial,
    isValidating,
  } = useSWRInfinite(getKey, getProducts);

  const products = data ? data.flatMap((page) => page.products) : [];
  const isLoadingMore = isValidating && size > 1;
  const isReachingEnd = data && data[data.length - 1]?.products.length < PAGE_SIZE;

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    const filtered = debouncedSearchTerm
      ? products.filter((product) =>
          product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      : products;

    const [key, order] = sortBy.split("-");
    const sorted = [...filtered].sort((a, b) => {
      let valA, valB;

      if (key === "price") {
        valA = a.price;
        valB = b.price;
      } else {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [products, debouncedSearchTerm, sortBy]);

  // CRUD Handlers
  const handleOpenCreateModal = () => {
    setEditingProduct(undefined);
    setIsFormModalOpen(true);
  };
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };
  const handleSuccess = () => {
    mutate(); // Revalidate data after create/update
  };

  const handleOpenDeleteAlert = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete || !data) return;

    const originalData = [...data];

    // Optimistic UI update
    const optimisticData = data.map((page) => ({
      ...page,
      products: page.products.filter((p) => p.id !== productToDelete.id),
    }));
    mutate(optimisticData, { revalidate: false });

    try {
      await deleteProduct(productToDelete.id);
      toast.success(`Product "${productToDelete.title}" deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete product. Restoring data.");
      mutate(originalData, { revalidate: false }); // Revert on error
    } finally {
      setIsDeleteAlertOpen(false);
      setProductToDelete(undefined);
    }
  };

  const renderContent = () => {
    if (isLoadingInitial) {
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
    if (products.length > 0 && filteredAndSortedProducts.length === 0) {
      return (
        <div className="text-center py-10 border rounded-md">
          <h3 className="text-xl font-medium">No Products Found</h3>
          <p className="text-muted-foreground">
            Your search for "{debouncedSearchTerm}" did not match any products.
          </p>
        </div>
      );
    }
    return (
      <ProductTable
        products={filteredAndSortedProducts}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteAlert}
      />
    );
  };

  return (
    <>
      <main className="container py-8">
        <div className="flex justify-between items-start gap-4 mb-6">
          <PageHeader
            title="SyncBoard"
            description="View, filter, and manage your product inventory."
          />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleOpenCreateModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
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

        <div className="space-y-6">
          {renderContent()}
          <div className="flex justify-center">
            <Button
              onClick={() => setSize(size + 1)}
              disabled={isLoadingMore || isReachingEnd}
              variant="outline"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : isReachingEnd ? (
                "No More Products"
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        </div>
      </main>

      <ProductFormModal
        isOpen={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        product={editingProduct}
        onSuccess={handleSuccess}
      />
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{productToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
