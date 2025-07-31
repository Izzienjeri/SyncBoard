
"use client";

import useSWR from "swr";
import { AlertTriangle, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductTable } from "@/components/features/product/product-table";
import { ProductTableSkeleton } from "@/components/features/product/product-table-skeleton";
import { getProducts } from "@/lib/api";

export default function DashboardPage() {
  const { data: products, error, isLoading } = useSWR("/products", getProducts);

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

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-10 border rounded-md">
          <h3 className="text-xl font-medium">No Products Found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first product.
          </p>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      );
    }

    return <ProductTable products={products} />;
  };

  return (
    <main className="container py-8">
      <div className="flex justify-between items-start mb-6">
        <PageHeader
          title="Products"
          description="View and manage your product inventory."
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="space-y-6">
        {renderContent()}
      </div>
    </main>
  );
}