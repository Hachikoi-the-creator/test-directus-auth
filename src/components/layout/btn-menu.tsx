"use client";

import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/context/sidebar-context";
import { Menu } from "lucide-react";

export default function BtnMenu() {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label="Open Menu"
    >
      <Menu />
    </Button>
  );
}
