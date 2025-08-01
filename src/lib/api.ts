import { User } from "@/types/api.types";
import { Teacher } from "./fake-generators";

/**
 * A generic fetcher function for use with SWR.
 * @param url The URL to fetch.
 * @returns The JSON response.
 */
export const fetcher = (url: string) => fetch(url).then(res => res.json());


/**
 * Adds a new student or teacher to the database.
 * @param userType - The type of user to add ('student' or 'teacher').
 * @param userData - The form data for the new user.
 * @returns The newly created user object.
 */
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

/**
 * Updates an existing student or teacher in the database.
 * @param userType - The type of user to update ('student' or 'teacher').
 * @param userId - The ID of the user to update.
 * @param userData - The updated form data.
 * @returns The updated user object.
 */
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

/**
 * Deletes a student or teacher from the database.
 * @param userType - The type of user to delete ('student' or 'teacher').
 * @param userId - The ID of the user to delete.
 * @returns A confirmation object.
 */
export async function deleteUser(userType: 'student' | 'teacher', userId: number): Promise<{ id: number, isDeleted: boolean }> {
  const res = await fetch(`/api/${userType}s/${userId}`, { method: "DELETE" });
  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to delete ${userType}`);
  }
  return res.json();
}



/**
 * Gets the total number of students.
 * @returns The total count of students.
 */
export async function getTotalStudents(): Promise<number> {
    const res = await fetch('/api/students?limit=0');
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total;
}

/**
 * Gets the total number of teachers.
 * @returns The total count of teachers.
 */
export async function getTotalTeachers(): Promise<number> {
    const res = await fetch('/api/teachers?limit=0');
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total;
}

/**
 * Gets the complete list of all teachers (not paginated).
 * @returns An array of all teacher objects.
 */
export async function getAllTeachers(): Promise<Teacher[]> {
    return fetcher('/api/teachers/all');
}



/**
 * Gets the list of all available subjects.
 * @returns An array of subject names.
 */
export async function getSubjects(): Promise<string[]> {
    return fetcher('/api/subjects');
}

/**
 * Adds a new subject to the database.
 * @param subjectName - The name of the new subject.
 * @returns The newly created subject object.
 */
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

/**
 * Updates a subject's name.
 * @param oldName - The current name of the subject.
 * @param newName - The new name for the subject.
 * @returns A confirmation object.
 */
export async function updateSubject(oldName: string, newName: string): Promise<{ oldName: string, newName: string }> {
    const res = await fetch(`/api/subjects/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSubjectName: newName }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update subject');
    }
    return res.json();
}

/**
 * Deletes a subject from the database.
 * @param subjectName - The name of the subject to delete.
 * @returns A confirmation message.
 */
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