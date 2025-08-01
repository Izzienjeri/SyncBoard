import type { AppUser } from "@/lib/schemas";

export interface UsersApiResponse {
    users: AppUser[];
    total: number;
    skip: number;
    limit: number;
}
