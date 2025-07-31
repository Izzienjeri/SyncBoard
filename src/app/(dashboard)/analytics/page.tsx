// app/(dashboard)/analytics/page.tsx

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Analytics & Reports"
        description="Deep dive into your sales, products, and customer data."
      />
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Advanced analytics and reporting
            features will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}