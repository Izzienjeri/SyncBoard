// === lib/api.ts ===
import { User, UsersApiResponse } from "@/types/api.types";
import { allSubjects, mockTeachers, subjectScoreData, subjectTeacherMapping } from "./mock-data";

const DUMMY_JSON_URL = "https://dummyjson.com";

export async function getUsers(url: string): Promise<UsersApiResponse> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    const data: UsersApiResponse = await res.json();
    return data;
  } catch {
    throw new Error("Could not retrieve users. Please try again later.");
  }
}

export async function addUser(userData: Partial<User>): Promise<User> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/users/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add user');
    }
    return await res.json();
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(e.message || "Could not add the user.");
    }
    throw new Error("An unknown error occurred while adding the user.");
  }
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<User> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return await res.json();
  } catch {
    throw new Error("Could not update the user.");
  }
}

export async function deleteUser(userId: number): Promise<{ id: number, isDeleted: boolean }> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/users/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
  } catch {
    throw new Error("Could not delete the user.");
  }
}

export async function getTotalStudents(): Promise<number> {
  return 100;
}

export async function getTotalTeachers(): Promise<number> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/users?limit=0`);
    if (!res.ok) {
      return 50;
    }
    const data: UsersApiResponse = await res.json();
    return data.total > 100 ? data.total - 100 : 0;
  } catch (e) {
    console.error("Failed to get total teachers:", e);
    return 50;
  }
}

export async function getSubjects(): Promise<string[]> {
  return Promise.resolve(allSubjects);
}

export async function addSubject(subjectName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const formattedName = subjectName.toLowerCase().replace(/\s+/g, '-');
    if (allSubjects.includes(formattedName)) {
      reject(new Error("Subject already exists."));
      return;
    }

    allSubjects.push(formattedName);
    
    const periods = ['this_term', 'last_term', 'full_year'];
    periods.forEach(period => {
      subjectScoreData[period].push({
        name: formattedName,
        averageScore: Math.floor(Math.random() * (95 - 70 + 1) + 70),
      });
    });

    if (mockTeachers.length > 0) {
        const randomTeacherId = mockTeachers[Math.floor(Math.random() * mockTeachers.length)].id;
        subjectTeacherMapping[formattedName] = [randomTeacherId];
    }

    resolve(formattedName);
  });
}