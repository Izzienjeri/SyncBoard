import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import { createRandomStudent, Student } from '@/lib/fake-generators';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = parseInt(searchParams.get('skip') || '0');
  const search = searchParams.get('search')?.toLowerCase() || '';

  let filteredStudents = db.students;

  if (search) {
    filteredStudents = db.students.filter(student =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search)
    );
  }

  const total = filteredStudents.length;
  const paginatedStudents = filteredStudents.slice(skip, skip + limit);

  return NextResponse.json({
    users: paginatedStudents,
    total: total,
    skip,
    limit,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newStudent: Student = {
    ...createRandomStudent(),
    ...body,
  };
  db.students.unshift(newStudent);
  return NextResponse.json(newStudent, { status: 201 });
}
