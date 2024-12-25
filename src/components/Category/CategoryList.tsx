import CategoryItem from "@/components/Category/CategoryItem";
import { Category } from "@/models/category.interface";
import {
  Pencil,
  Monitor,
  BarChart,
  Smartphone,
  HardHat,
  Cpu,
  Building2,
  FileText,
} from "lucide-react";

const categories: Category[] = [
  {
    id: 1,
    icon: <Pencil className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Design & Creative",
  },
  {
    id: 2,
    icon: <Monitor className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Design & Development",
  },
  {
    id: 3,
    icon: <BarChart className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Sales & Marketing",
  },
  {
    id: 4,
    icon: <Smartphone className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Mobile Application",
  },
  {
    id: 5,
    icon: <HardHat className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Construction",
  },
  {
    id: 6,
    icon: <Cpu className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Information Technology",
  },
  {
    id: 7,
    icon: <Building2 className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Real Estate",
  },
  {
    id: 8,
    icon: <FileText className="w-8 h-8 text-[#1a2b6d]" />,
    name: "Content Writer",
  },
];

export default function CategoriesGrid() {
  return (
    <section className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            FEATURED TOURS PACKAGES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Browse Top Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryItem key={category.id} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
