import { Pivot } from "@/models/pivot-user-post";
import { Post } from "@/models/post.interface";
import { User } from "@/models/user.interface";

export interface UserPost {
    user: User;
    post: Post;
    cover_letter: string | null;
    subject: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    cv: string | null;
}