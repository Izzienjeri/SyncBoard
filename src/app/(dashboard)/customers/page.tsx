import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Customer Management"
        description="View customer profiles and order history."
      />
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Soon you&apos;ll be able to manage
            all your customer data from here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}