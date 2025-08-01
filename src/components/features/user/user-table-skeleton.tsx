import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableSkeletonProps {
  type: 'student' | 'teacher';
}

export function UserTableSkeleton({ type }: UserTableSkeletonProps) {
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div className="rounded-xl border glass-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            {type === 'student' && <TableHead>Grade</TableHead>}
            {type === 'teacher' && <TableHead>Primary Subject</TableHead>}
            {type === 'teacher' && <TableHead>Mean Grade</TableHead>}
            <TableHead className="w-[50px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              {type === 'teacher' && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
