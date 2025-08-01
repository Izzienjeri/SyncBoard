import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerTableSkeletonProps {
  type: 'student' | 'teacher';
}

export function CustomerTableSkeleton({ type }: CustomerTableSkeletonProps) {
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Parent Phone</TableHead>
            {type === 'student' && <TableHead>This Term&apos;s Grade</TableHead>}
            {type === 'teacher' && <TableHead>Subject</TableHead>}
            {type === 'teacher' && <TableHead>Mean Grade</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              {type === 'teacher' && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
