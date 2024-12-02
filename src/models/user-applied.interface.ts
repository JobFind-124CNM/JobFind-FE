import { Pivot } from "@/models/pivot-user-post";
import { User } from "@/models/user.interface";

export interface UserApplied {
    user: User;
    pivot: Pivot;
}