import { User, UsersApiResponse } from "@/types/api.types";
import { allSubjects } from "./mock-data";

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
