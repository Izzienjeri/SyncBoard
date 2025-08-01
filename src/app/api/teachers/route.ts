import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import { createRandomTeacher, Teacher } from '@/lib/fake-generators';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = parseInt(searchParams.get('skip') || '0');
  const search = searchParams.get('search')?.toLowerCase() || '';

  let filteredTeachers = db.teachers;

  if (search) {
    filteredTeachers = db.teachers.filter(teacher =>
      teacher.firstName.toLowerCase().includes(search) ||
      teacher.lastName.toLowerCase().includes(search) ||
      teacher.email.toLowerCase().includes(search)
    );
  }
  
  const total = filteredTeachers.length;
  const paginatedTeachers = filteredTeachers.slice(skip, skip + limit);

  return NextResponse.json({
    users: paginatedTeachers,
    total: total,
    skip,
    limit,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTeacher: Teacher = {
    ...createRandomTeacher(),
    ...body,
  };
  db.teachers.unshift(newTeacher);
  return NextResponse.json(newTeacher, { status: 201 });
}
