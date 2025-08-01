import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// A utility function to merge Tailwind CSS classes, resolving conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
