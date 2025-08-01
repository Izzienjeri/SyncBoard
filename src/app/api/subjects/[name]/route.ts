import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import type { Teacher } from '@/lib/schemas';

export async function PUT(request: Request, context: { params: { name: string } }) {
  const oldSubjectName = decodeURIComponent(context.params.name);
  const { newSubjectName, teacherIds } = await request.json();

  const subjectIndex = db.subjects.findIndex(s => s.toLowerCase() === oldSubjectName.toLowerCase());
  if (subjectIndex === -1) {
    return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
  }

  const finalName = newSubjectName || oldSubjectName;

  if (newSubjectName && newSubjectName !== oldSubjectName) {
    db.subjects[subjectIndex] = newSubjectName;
    db.teachers.forEach((teacher: Teacher) => {
      if (teacher.subject.toLowerCase() === oldSubjectName.toLowerCase()) {
        teacher.subject = finalName;
      }
    });
  }

  if (teacherIds && Array.isArray(teacherIds)) {
    db.teachers.forEach((teacher: Teacher) => {
        if (teacher.subject.toLowerCase() === finalName.toLowerCase() && !teacherIds.includes(teacher.id)) {
            teacher.subject = 'Unassigned';
        }
    });
    
    teacherIds.forEach((id: number) => {
      const teacher = db.teachers.find(t => t.id === id);
      if (teacher) {
        teacher.subject = finalName;
      }
    });
  }

  return NextResponse.json({ message: "Subject updated successfully." });
}

export async function DELETE(request: Request, context: { params: { name: string } }) {
    const subjectNameToDelete = decodeURIComponent(context.params.name);
    const subjectIndex = db.subjects.findIndex(s => s.toLowerCase() === subjectNameToDelete.toLowerCase());

    if (subjectIndex === -1) {
        return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }

    db.subjects.splice(subjectIndex, 1);

    db.teachers.forEach((teacher: Teacher) => {
        if (teacher.subject.toLowerCase() === subjectNameToDelete.toLowerCase()) {
            teacher.subject = 'Unassigned';
        }
    });
    
    return NextResponse.json({ message: `Subject "${subjectNameToDelete}" deleted successfully.` });
}