import { UsersRoles } from "src/data/users-roles";

export interface SafeProfileInfo {
    login: string;
    email: string;
    role: UsersRoles
    access_token?: string;
    refresh_token?: string;
}