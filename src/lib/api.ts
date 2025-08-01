
import { User } from "@/types/api.types";

export const fetcher = (url: string) => fetch(url).then(res => res.json());

export async function addUser(userType: 'student' | 'teacher', userData: Partial<User>): Promise<User> {
  const res = await fetch(`/api/${userType}s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Failed to add ${userType}`);
  }
  return res.json();
}

export async function updateUser(userType: 'student' | 'teacher', userId: number, userData: Partial<User>): Promise<User> {
  const res = await fetch(`/api/${userType}s/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to update ${userType}`);
  }
  return res.json();
}

export async function deleteUser(userType: 'student' | 'teacher', userId: number): Promise<{ id: number, isDeleted: boolean }> {
  const res = await fetch(`/api/${userType}s/${userId}`, { method: "DELETE" });
  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to delete ${userType}`);
  }
  return res.json();
}

export async function getTotalStudents(): Promise<number> {
    const res = await fetch('/api/students?limit=0');
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total;
}

export async function getTotalTeachers(): Promise<number> {
    const res = await fetch('/api/teachers?limit=0');
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total;
}

export async function getSubjects(): Promise<string[]> {
    return fetcher('/api/subjects');
}

export async function addSubject(subjectName: string): Promise<{ name: string }> {
    const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectName }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add subject');
    }
    return res.json();
}