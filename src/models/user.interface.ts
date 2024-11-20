export interface User {
    id: number;
    username: string;
    email: string;
    status: string;
    avatar: string;
    cv?: string;
    gender?: string;
    password?: string;
    experience?: string;
    phone?: string;
    role?: string;
    created_at: string;
    updated_at: string;
}