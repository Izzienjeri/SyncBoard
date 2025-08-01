import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import { createRandomTeacher, Teacher } from '@/lib/fake-generators';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = parseInt(searchParams.get('skip') || '0');

  const paginatedTeachers = db.teachers.slice(skip, skip + limit);

  return NextResponse.json({
    users: paginatedTeachers,
    total: db.teachers.length,
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