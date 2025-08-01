import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';
import { Teacher } from '@/lib/fake-generators';

export async function PUT(request: Request, { params }: { params: { name: string } }) {
  const oldSubjectName = decodeURIComponent(params.name);
  const { newSubjectName } = await request.json();

  if (!newSubjectName) {
    return NextResponse.json({ message: 'New subject name is required.' }, { status: 400 });
  }

  const subjectIndex = db.subjects.findIndex(s => s.toLowerCase() === oldSubjectName.toLowerCase());
  if (subjectIndex === -1) {
    return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
  }
  
  db.subjects[subjectIndex] = newSubjectName;

  db.teachers.forEach((teacher: Teacher) => {
    if (teacher.subject.toLowerCase() === oldSubjectName.toLowerCase()) {
      teacher.subject = newSubjectName;
    }
  });

  return NextResponse.json({ oldName: oldSubjectName, newName: newSubjectName });
}

export async function DELETE(request: Request, { params }: { params: { name: string } }) {
    const subjectNameToDelete = decodeURIComponent(params.name);
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