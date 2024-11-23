import { Category } from "@/models/category.interface";

export default function CategoryItem(category: Category) {
  return (
    <div>
      <a
        href="#"
        className="group flex flex-col items-center p-8 bg-white rounded-lg border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
          {category.icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
        <span className="text-primary">1</span>
      </a>
    </div>
  );
}
