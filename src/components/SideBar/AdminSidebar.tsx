import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import {
  BookAIcon,
  Building2,
  BuildingIcon,
  ChartAreaIcon,
  ChevronRight,
  Eye,
  GraduationCap,
  LayoutDashboard,
  Newspaper,
  Package,
  Tag,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHr, setIsHr] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const roles = currentUser.roles || [];
      setIsAdmin(roles.some((role) => role.name.toUpperCase() === "ADMIN"));
      setIsHr(roles.some((role) => role.name.toUpperCase() === "HR"));
    }
  }, [currentUser]);

  const navigationItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý bài đăng",
      icon: <Newspaper className="h-5 w-5" />,
      href: "/admin/hr/posts",
      allowedRoles: ["HR"],
    },
    {
      title: "Quản lý bài đăng",
      icon: <Newspaper className="h-5 w-5" />,
      href: "/admin/posts",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý User",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý tag",
      icon: <Tag className="h-5 w-5" />,
      href: "/admin/tags",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý cấp bậc",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/admin/levels",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý quyền user",
      icon: <UserRoundCog className="h-5 w-5" />,
      href: "/admin/roles",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý hình thức làm việc",
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/form-of-works",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý khu vực",
      icon: <ChartAreaIcon className="h-5 w-5" />,
      href: "/admin/areas",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý danh mục làm việc",
      icon: <BookAIcon className="h-5 w-5" />,
      href: "/admin/categories",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý vị trí làm việc",
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/positions",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý công ty",
      icon: <BuildingIcon className="h-5 w-5" />,
      href: "/admin/companies",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Quản lý các gói bài đăng",
      icon: <Eye className="h-5 w-5" />,
      href: "/admin/candidate-packages",
      allowedRoles: ["ADMIN"],
    },
    {
      title: "Công ty của tôi",
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/hr/my-company",
      allowedRoles: ["HR"],
    },
  ];

  // Lọc các mục menu theo vai trò
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (isAdmin && item.allowedRoles.includes("ADMIN")) return true;
    if (isHr && item.allowedRoles.includes("HR")) return true;
    return false;
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-200 ease-in-out border-r",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center">
          <img src="/logo.png.webp" alt="Job Finder Logo" className="h-12" />
        </Link>
      </div>

      <nav className="space-y-0.5 p-2 pt-4">
        {filteredNavigationItems.map((item) => (
          <div key={item.href} className="h-10">
            <Link
              to={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                location.pathname === item.href
                  ? "bg-[#4540E1] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
