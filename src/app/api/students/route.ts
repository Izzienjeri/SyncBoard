import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import { createRandomStudent, Student } from '@/lib/fake-generators';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = parseInt(searchParams.get('skip') || '0');

  const paginatedStudents = db.students.slice(skip, skip + limit);

  return NextResponse.json({
    users: paginatedStudents,
    total: db.students.length,
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