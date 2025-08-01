import type { AppUser, Teacher } from "@/lib/schemas";

// Generic fetcher function for use with data-fetching libraries like SWR.
export const fetcher = (url: string) => fetch(url).then(res => res.json());


export async function addUser(userType: 'student' | 'teacher', userData: Partial<AppUser>): Promise<AppUser> {
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


export async function updateUser(userType: 'student' | 'teacher', userId: number, userData: Partial<AppUser>): Promise<AppUser> {
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

// Fetches only the total count of students by setting the limit to 0.
export async function getTotalStudents(): Promise<number> {
    const res = await fetch('/api/students?limit=0');
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total;
}

// Fetches only the total count of teachers by setting the limit to 0.
export async function getTotalTeachers(): Promise<number> {
    const res = await fetch('/api/teachers?limit=0');
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total;
}

// Fetches the complete, unpaginated list of all teachers.
export async function getAllTeachers(): Promise<Teacher[]> {
    return fetcher('/api/teachers/all');
}


export async function getSubjects(): Promise<string[]> {
    return fetcher('/api/subjects');
}


export async function addSubject(data: { subjectName: string; teacherIds: number[] }): Promise<{ name: string }> {
    const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add subject');
    }
    return res.json();
}


export async function updateSubject(oldName: string, data: { newSubjectName: string, teacherIds: number[] }): Promise<{ message: string }> {
    const res = await fetch(`/api/subjects/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update subject');
    }
    return res.json();
}


export async function deleteSubject(subjectName: string): Promise<{ message: string }> {
    const res = await fetch(`/api/subjects/${encodeURIComponent(subjectName)}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete subject');
    }
    return res.json();
}
