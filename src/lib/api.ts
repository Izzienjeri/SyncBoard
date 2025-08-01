import { User, UsersApiResponse } from "@/types/api.types";
import { Course } from "@/types/course.types";
import { CourseSchema } from "@/validators/course.schema";
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


export async function getTotalCourses(): Promise<number> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/products?limit=0`);
    if (!res.ok) {
      return 194;
    }
    const data = await res.json();
    return data.total;
  } catch (e) {
    console.error("Failed to get total courses:", e);
    return 194;
  }
}

export async function getCourses(url: string): Promise<Course[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }
    const data = await res.json();
    return data.products.map((course: Course) => ({
      ...course,
      createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
      createdBy: "Admin",
    }));
  } catch {
    throw new Error("Could not retrieve courses. Please try again later.");
  }
}

export async function createCourse(courseData: CourseSchema): Promise<Course> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error("Failed to create course");
    const newCourse: Course = await res.json();
    return { ...newCourse, createdAt: new Date().toISOString(), createdBy: "System" };
  } catch {
    throw new Error("Could not create the course.");
  }
}

export async function updateCourse(courseId: number, courseData: Partial<CourseSchema>): Promise<Course> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/products/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error("Failed to update course");
    const updatedCourse: Course = await res.json();
    return { ...updatedCourse, ...courseData, updatedAt: new Date().toISOString(), updatedBy: "System" };
  } catch {
    throw new Error("Could not update the course.");
  }
}

export async function deleteCourse(courseId: number): Promise<Course> {
  try {
    const res = await fetch(`${DUMMY_JSON_URL}/products/${courseId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete course");
    return await res.json();
  } catch {
    throw new Error("Could not delete the course.");
  }
}