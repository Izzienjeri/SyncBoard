import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import type { Student } from '@/lib/schemas';

export async function GET() {
  const students: Student[] = db.students;
  const totalStudents = students.length;

  if (totalStudents === 0) {
    return NextResponse.json({
      passRate: "0.0%",
      gradeDistribution: [
        { grade: "A", count: 0 }, { grade: "B", count: 0 },
        { grade: "C", count: 0 }, { grade: "D", count: 0 },
        { grade: "F", count: 0 }
      ]
    });
  }

  // Calculate Grade Distribution
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  students.forEach(student => {
    if (student.grade in gradeCounts) {
      gradeCounts[student.grade as keyof typeof gradeCounts]++;
    }
  });
  
  const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count }));

  // Calculate Pass Rate (all grades except 'F' are passing)
  const failingStudents = gradeCounts.F;
  const passingStudents = totalStudents - failingStudents;
  const passRate = ((passingStudents / totalStudents) * 100).toFixed(1) + '%';
  
  return NextResponse.json({ passRate, gradeDistribution });
}
