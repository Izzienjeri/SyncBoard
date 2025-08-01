import { NextResponse } from 'next/server';
import db from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(db.subjects.sort());
}

export async function POST(request: Request) {
  const { subjectName } = await request.json();
  if (!subjectName) {
    return NextResponse.json({ message: "Subject name is required." }, { status: 400 });
  }
  
  const formattedName = subjectName.charAt(0).toUpperCase() + subjectName.slice(1).toLowerCase();

  if (db.subjects.find(s => s.toLowerCase() === formattedName.toLowerCase())) {
    return NextResponse.json({ message: "Subject already exists." }, { status: 409 });
  }

  db.subjects.push(formattedName);
  return NextResponse.json({ name: formattedName }, { status: 201 });
}