import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/SideBar/AdminSidebar";
import AdminHeader from "@/components/Header/AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        <AdminHeader onMenuClick={toggleSidebar} />

        <main className="p-4 lg:pt-20">{children}</main>
      </div>
    </div>
  );
}
