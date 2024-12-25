import { Company } from "@/models/company.interface";
import { Role } from "@/models/role.interface";

export interface User {
    id: number;
    username: string;
    email: string;
    status: string;
    avatar: string;
    cv?: File | null;
    gender?: string;
    experience?: string;
    phone?: string;
    roles?: Role[];
    created_at: string;
    updated_at: string;
    is_deleted?: boolean;
    company?: Company;
}