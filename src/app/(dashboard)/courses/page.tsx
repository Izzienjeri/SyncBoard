"use client";

import useSWR from "swr";
import { AlertTriangle, Book } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSubjects } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
  const { data: subjects, error, isLoading } = useSWR("subjects", getSubjects);

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-full" />
                ))}
            </div>
        )
    };
    if (error) return (
      <Alert variant="destructive" className="glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load subjects. Please try again.</AlertDescription>
      </Alert>
    );
    if (!subjects || subjects.length === 0) return (
      <div className="text-center py-10 glass-card rounded-lg">
        <h3 className="text-xl font-medium">No Subjects Found</h3>
        <p className="text-muted-foreground">Could not find any subjects in the catalog.</p>
      </div>
    );
    return (
        <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="text-base px-4 py-2 capitalize cursor-default">
                    {subject.replace(/-/g, ' ')}
                </Badge>
            ))}
        </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader title="Available Subjects" description="A list of all subjects offered." />
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Subject Catalog
                </CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
      </div>
    </>
  );
}
