import { Area } from "@/models/area.interface";
import { Category } from "@/models/category.interface";
import { Company } from "@/models/company.interface";
import { FormOfWork } from "@/models/form-of-work.interface";
import { Level } from "@/models/level.interface";
import { Position } from "@/models/position.interface";
import { Tag } from "@/models/tag.interface";
import { User } from "@/models/user.interface";

export interface Post {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    benefit: string;
    company: Company;
    form_of_work: FormOfWork;
    salary: string;
    category: Category;
    amount: number;
    due_at: string;
    area: Area;
    qualification: string;
    users?: User[];
    levels?: Level[];
    tags?: Tag[];
    positions?: Position[];
}