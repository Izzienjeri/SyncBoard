"use client";

import { useState } from "react";
import useSWR from "swr";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSubjects } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTeachers, subjectTeacherMapping, subjectScoreData, Teacher } from "@/lib/mock-data";

type Period = "this_term" | "last_term" | "full_year";

const TeacherAvatar = ({ teacherName }: { teacherName: string }) => {
  const initials = teacherName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  return (
    <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
      <span className="text-xs font-semibold text-muted-foreground">{initials}</span>
    </div>
  );
};

export default function SubjectsPage() {
  const [period, setPeriod] = useState<Period>("this_term");
  const { data: subjects, error, isLoading } = useSWR("subjects", getSubjects);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load subjects. Please try again.</AlertDescription>
        </Alert>
      );
    }
    if (!subjects || subjects.length === 0) {
      return (
        <div className="text-center py-10 glass-card rounded-lg">
          <h3 className="text-xl font-medium">No Subjects Found</h3>
          <p className="text-muted-foreground">Could not find any subjects in the catalog.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const meanGradeData = subjectScoreData[period].find(s => s.name === subject);
          const teacherIds = subjectTeacherMapping[subject] || [];
          const teachers = teacherIds.map(id => mockTeachers.find(t => t.id === id)).filter(Boolean) as Teacher[];

          return (
            <Card key={subject} className="glass-card flex flex-col">
              <CardHeader>
                <CardTitle className="capitalize">{subject.replace(/-/g, ' ')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mean Grade ({period.replace(/_/g, ' ')})</p>
                  <p className="text-3xl font-bold text-primary">{meanGradeData?.averageScore.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Instructors</p>
                  <div className="flex flex-col gap-2">
                    {teachers.length > 0 ? (
                      teachers.map(teacher => (
                        <div key={teacher.id} className="flex items-center gap-3">
                          <TeacherAvatar teacherName={teacher.name} />
                          <span className="font-medium text-sm">{teacher.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No instructors assigned.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subjects Overview" description="View details for each subject offered.">
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_term">This Term</SelectItem>
            <SelectItem value="last_term">Last Term</SelectItem>
            <SelectItem value="full_year">Full Year</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>
      {renderContent()}
    </div>
  );
}
