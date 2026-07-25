export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    google_id: string;
    name: string;
    email: string;
    profile: string;
    role: UserRole;
    is_blocked: boolean;
    created_at: Date;
}
