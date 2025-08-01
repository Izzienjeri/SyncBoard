import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableSkeletonProps {
  type: 'student' | 'teacher';
  items: number;
}

export function UserTableSkeleton({ type, items = 10 }: UserTableSkeletonProps) {
  const skeletonRows = Array.from({ length: items });

  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[70px] px-3 py-2">User ID</TableHead>
          <TableHead className="px-3 py-2">Name</TableHead>
          <TableHead className="hidden sm:table-cell px-3 py-2">Email</TableHead>
          <TableHead className="hidden md:table-cell px-3 py-2">Phone</TableHead>
          {type === 'student' && <TableHead className="px-3 py-2">Grade</TableHead>}
          {type === 'teacher' && <TableHead className="px-3 py-2">Subject</TableHead>}
          <TableHead className="w-[50px] px-3 py-2 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((_, index) => (
          <TableRow key={index}>
            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-12" /></TableCell>
            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell className="hidden sm:table-cell px-3 py-2"><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell className="hidden md:table-cell px-3 py-2"><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell className="px-3 py-2"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right px-3 py-2"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
