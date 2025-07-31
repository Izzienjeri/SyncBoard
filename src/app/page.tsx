"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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
// NOTE: I've updated this import path to match your corrected file structure
import { ProductTable } from "@/components/features/product/product-table"; 
import { ProductTableSkeleton } from "@/components/features/product/product-table-skeleton";
import { ProductFormModal } from "@/components/features/product/product-form-modal";
import { ProductPreviewModal } from "@/components/features/product/product-preview-modal";
import { Pagination } from "@/components/ui/pagination";
import { getProducts, deleteProduct, updateProduct } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Product } from "@/types/product.types";
import { ProductSchema } from "@/validators/product.schema";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | undefined>(undefined);

  // Data & Filtering States
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // The 'error' variable is used in renderContent, so we keep it here.
  const { data: products, error, isLoading, mutate } = useSWR("https://fakestoreapi.com/products", getProducts);

  useEffect(() => {
    if (products) {
      setDisplayProducts(products);
    }
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!displayProducts) return [];

    let processedProducts = [...displayProducts];

    // Filtering
    if (debouncedSearchTerm) {
      processedProducts = processedProducts.filter((product) =>
        product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    // Sorting (unless custom order is active)
    if (sortBy !== 'custom') {
      const [key, order] = sortBy.split("-");
      processedProducts.sort((a, b) => {
        const valA = key === "price" ? a.price : a.title.toLowerCase();
        const valB = key === "price" ? b.price : b.title.toLowerCase();
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return processedProducts;
  }, [displayProducts, debouncedSearchTerm, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Handlers
  const handleSuccess = () => mutate();
  
  const handleOpenCreateModal = () => {
    setEditingProduct(undefined);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };
  
  const handleOpenPreviewModal = (product: Product) => {
    setPreviewProduct(product);
    setIsPreviewModalOpen(true);
  };

  const handleOpenDeleteAlert = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete || !products) return;
    const optimisticData = products.filter((p) => p.id !== productToDelete.id);
    mutate(optimisticData, { revalidate: false });
    try {
      await deleteProduct(productToDelete.id);
      toast.success(`Product "${productToDelete.title}" deleted.`);
    } catch {
      toast.error("Failed to delete product. Restoring data.");
      mutate(products, { revalidate: true });
    } finally {
      setIsDeleteAlertOpen(false);
      setProductToDelete(undefined);
    }
  };

  const handleInlineUpdate = async (productId: number, data: Partial<ProductSchema>) => {
    const originalProducts = [...displayProducts];
    const updatedProducts = displayProducts.map(p => p.id === productId ? { ...p, ...data } : p);
    setDisplayProducts(updatedProducts); // Optimistic update
    
    try {
      await updateProduct(productId, data);
      toast.success("Product updated successfully!");
      mutate(updatedProducts, { revalidate: false }); // Update SWR cache
    } catch { // The error variable is not needed here
      toast.error("Failed to update product.");
      setDisplayProducts(originalProducts); // Revert on failure
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDisplayProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setSortBy('custom'); // Switch to custom sort
      setCurrentPage(1); // Reset to first page after reorder
    }
  };

  const renderContent = () => {
    if (isLoading) return <ProductTableSkeleton />;
    if (error) return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load products. Please try again.</AlertDescription>
      </Alert>
    );
    if (paginatedProducts.length === 0 && debouncedSearchTerm) return (
      <div className="text-center py-10 border rounded-lg bg-card text-card-foreground">
        <h3 className="text-xl font-medium">No Products Found</h3>
        <p className="text-muted-foreground">Your search for &quot;{debouncedSearchTerm}&quot; did not match any products.</p>
      </div>
    );
    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ProductTable
          products={paginatedProducts}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteAlert}
          onPreview={handleOpenPreviewModal}
          onInlineUpdate={handleInlineUpdate}
        />
      </DndContext>
    );
  };

  return (
    <>
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <PageHeader title="SyncBoard" description="Modern product inventory management." />
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ThemeToggle />
            <Button onClick={handleOpenCreateModal} className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom" disabled={sortBy !== 'custom'}>Custom Order</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {renderContent()}
          {filteredAndSortedProducts.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>

      <ProductFormModal isOpen={isFormModalOpen} onOpenChange={setIsFormModalOpen} product={editingProduct} onSuccess={handleSuccess} />
      <ProductPreviewModal isOpen={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen} product={previewProduct} />
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete &quot;{productToDelete?.title}&quot;.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}