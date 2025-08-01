import { createRandomStudent, createRandomTeacher } from './fake-generators';
import type { Student, Teacher } from './schemas';

const initialSubjects = [
  "mathematics", "physics", "history", "english", "computer-science",
  "biology", "chemistry", "art-history", "philosophy", "economics",
  "political-science", "music-theory",
];

const globalForDb = global as unknown as {
  db: {
    students: Student[];
    teachers: Teacher[];
    subjects: string[];
  }
};

const seedDatabase = () => {
  console.log("🌱 Seeding database with mock data...");
  const students = Array.from({ length: 100 }, createRandomStudent);
  const teachers = Array.from({ length: 25 }, createRandomTeacher);
  
  return {
    students,
    teachers,
    subjects: initialSubjects.map((s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())),
  };
};

const db = globalForDb.db || seedDatabase();

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export default db;