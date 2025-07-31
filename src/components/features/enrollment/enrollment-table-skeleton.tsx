import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function EnrollmentTableSkeleton() {
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Enrollment ID</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead className="text-center">Courses</TableHead>
            <TableHead className="text-center">Total Items</TableHead>
            <TableHead className="text-right">Total Price</TableHead>
            <TableHead className="text-right">Discounted Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
              <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
              <TableCell><div className="flex justify-end"><Skeleton className="h-6 w-24 rounded-full" /></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
