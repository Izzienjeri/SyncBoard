import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import { Student } from '@/lib/fake-generators';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const studentId = parseInt(params.id);
  const studentIndex = db.students.findIndex((s: Student) => s.id === studentId);

  if (studentIndex === -1) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }
  
  const body = await request.json();
  db.students[studentIndex] = { ...db.students[studentIndex], ...body };
  return NextResponse.json(db.students[studentIndex]);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const studentId = parseInt(params.id);
  const studentIndex = db.students.findIndex((s: Student) => s.id === studentId);

  if (studentIndex === -1) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }
  
  const [deletedStudent] = db.students.splice(studentIndex, 1);
  return NextResponse.json({ ...deletedStudent, isDeleted: true });
}