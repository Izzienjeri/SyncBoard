import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/api.types";

export function CustomerTable({ customers }: { customers: User[] }) {
  return (
    <div className="rounded-lg border bg-card backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="relative h-10 w-10">
                    <Image src={user.image} alt={`${user.firstName} ${user.lastName}`} fill sizes="40px" className="rounded-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
