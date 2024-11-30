import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Clock,
  Building2,
  GraduationCap,
  Package,
  Eye,
  ChevronRight,
  RollerCoaster,
  UserRoundCog,
  Tag,
  Newspaper,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Quản lý bài đăng",
      icon: <Newspaper className="h-5 w-5" />,
      href: "/admin/posts",
    },
    {
      title: "Quản lý User",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      title: "Quản lý loại công việc",
      icon: <Briefcase className="h-5 w-5" />,
      href: "/admin/job-types",
    },
    {
      title: "Quản lý tag",
      icon: <Tag className="h-5 w-5" />,
      href: "/admin/tags",
    },
    {
      title: "Quản lý cấp bậc",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/admin/levels",
    },
    {
      title: "Quản lý quyền user",
      icon: <UserRoundCog className="h-5 w-5" />,
      href: "/admin/roles",
    },
    {
      title: "Quản lý hình thức làm việc",
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/work-types",
    },
    {
      title: "Quản lý khoảng lương",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/salary-ranges",
      subItems: [
        { title: "Danh sách khoảng lương", href: "/admin/salary-ranges" },
        { title: "Thêm khoảng lương", href: "/admin/salary-ranges/create" },
      ],
    },
    {
      title: "Quản lý các gói bài đăng",
      icon: <Eye className="h-5 w-5" />,
      href: "/admin/candidate-packages",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-200 ease-in-out border-r",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/admin" className="flex items-center">
          <img src="/logo.png.webp" alt="Job Finder Logo" className="h-12" />
        </Link>
      </div>

      <nav className="space-y-0.5 p-2 pt-4">
        {navigationItems.map((item) => (
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
              {item.subItems && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    location.pathname.startsWith(item.href) && "rotate-90"
                  )}
                />
              )}
            </Link>
            {item.subItems && location.pathname.startsWith(item.href) && (
              <div className="ml-9 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      "block px-3 py-2 text-sm rounded-lg transition-colors",
                      location.pathname === subItem.href
                        ? "bg-[#4540E1] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
