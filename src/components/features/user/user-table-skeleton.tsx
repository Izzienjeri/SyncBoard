import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableSkeletonProps {
  type: 'student' | 'teacher';
  items: number; // New prop to control how many skeleton rows to show
}

export function UserTableSkeleton({ type, items = 10 }: UserTableSkeletonProps) {
  const skeletonRows = Array.from({ length: items });

  return (
    <div className="rounded-lg border bg-card/80 backdrop-blur-lg overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            {type === 'student' && <TableHead>Grade</TableHead>}
            {type === 'teacher' && <TableHead>Subject</TableHead>}
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
              <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
