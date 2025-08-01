
import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import type { Teacher } from '@/lib/schemas';

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teacherId = parseInt(id);
  const teacherIndex = db.teachers.findIndex((t: Teacher) => t.id === teacherId);

  if (teacherIndex === -1) {
    return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
  }
  const body = await request.json();
  db.teachers[teacherIndex] = { ...db.teachers[teacherIndex], ...body };
  return NextResponse.json(db.teachers[teacherIndex]);
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teacherId = parseInt(id);
  const teacherIndex = db.teachers.findIndex((t: Teacher) => t.id === teacherId);

  if (teacherIndex === -1) {
    return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
  }
  const [deletedTeacher] = db.teachers.splice(teacherIndex, 1);
  return NextResponse.json({ ...deletedTeacher, isDeleted: true });
}