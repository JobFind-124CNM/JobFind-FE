import { Pivot } from "@/models/pivot-user-post";
import { User } from "@/models/user.interface";

export interface UserPost {
    user: User;
    pivot: Pivot
}