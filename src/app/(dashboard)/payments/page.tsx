import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Payments & Transactions"
        description="View payment history, status, and process refunds."
      />
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Soon you&apos;ll be able to manage
            all your financial transactions and reports from here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}