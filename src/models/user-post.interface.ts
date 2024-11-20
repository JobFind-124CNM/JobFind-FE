import { Post } from "@/models/post.interface";
import { User } from "@/models/user.interface";

export interface UserPost {
    user: User;
    post: Post;
    coverLetter: string;
    subject: string;
    status: string;
    created_at: string;
    updated_at: string;
}