"use client";

import { useSidebarStore } from "@/context/sidebar-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BtnHide from "./btn-hide";
import { dashboardConfig } from "./dashboard-config";

export default function DashboardSidebar() {
  const { sidebarOpen } = useSidebarStore();
  const currentPath = usePathname();

  return (
    <aside
      className={`absolute left-0 top-0 z-50 flex h-screen w-64 -translate-x-full flex-col overflow-y-hidden shadow-md duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-sidebar`}
    >
      <div className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4">
        <Image src="/logo.svg" alt="logo" width={40} height={40} /> Dorstep
        <BtnHide />
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 lg:mt-9">
          {dashboardConfig.map((item, index) => {
            return (
              <div key={index}>
                <Link href={item.href}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      currentPath === item.href ? "bg-accent" : "transparent"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
