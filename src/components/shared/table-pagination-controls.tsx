"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

interface TablePaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: string) => void;
  totalItems: number;
  itemType: string;
  itemsPerPageOptions?: number[];
}

export function TablePaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  itemType,
  itemsPerPageOptions = [10, 20, 30, 40, 50],
}: TablePaginationControlsProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? `Showing ${startItem}-${endItem} of ${totalItems} ${itemType}` : `No ${itemType} found`}
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
            <Select
              value={`${itemsPerPage}`}
              onValueChange={onItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {itemsPerPageOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        {totalPages > 1 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        )}
      </div>
    </div>
  );
}
