"use client";

import Header from "@/components/layout/header";
import DashboardSidebar from "@/components/layout/sidebard";
import { ThemeProvider } from "@/components/layout/theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header user={null} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
