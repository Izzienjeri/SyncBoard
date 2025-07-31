import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cart } from "@/types/api.types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function EnrollmentTable({ enrollments }: { enrollments: Cart[] }) {
  return (
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
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
            {enrollments.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell className="font-medium">#{cart.id}</TableCell>
                <TableCell>User #{cart.userId}</TableCell>
                <TableCell className="text-center">{cart.totalProducts}</TableCell>
                <TableCell className="text-center">{cart.totalQuantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(cart.total)}</TableCell>
                <TableCell className="text-right font-semibold">
                  <Badge variant="default" className="button-gradient">{formatCurrency(cart.discountedTotal)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
