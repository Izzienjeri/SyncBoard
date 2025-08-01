import { createRandomStudent, createRandomTeacher } from './fake-generators';
import type { Student, Teacher } from './schemas';

const initialSubjects = [
  "mathematics", "physics", "history", "english", "computer-science",
  "biology", "chemistry", "art-history", "philosophy", "economics",
  "political-science", "music-theory",
];

// Persist the mock database in a global variable during development to avoid re-seeding on every hot reload.
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
    // Format subject strings for display (e.g., 'computer-science' -> 'Computer Science').
    subjects: initialSubjects.map((s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())),
  };
};

// Use the existing global database instance or seed a new one.
const db = globalForDb.db || seedDatabase();

// In non-production environments, save the database to the global object.
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export default db;
