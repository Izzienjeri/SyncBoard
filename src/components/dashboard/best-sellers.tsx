import Image from "next/image";
import { bestSellersData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function BestSellers() {
  return (
    <div className="space-y-4">
      {bestSellersData.map((item) => (
        <div key={item.name} className="flex items-center gap-4">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="48px"
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.sales} sales
            </p>
          </div>
          <div className="font-medium">{formatCurrency(item.revenue)}</div>
        </div>
      ))}
    </div>
  );
}