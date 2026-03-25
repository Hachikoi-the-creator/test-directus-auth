import type { LucideIcon } from "lucide-react";
import { BookOpen, FileText, KeyRound, Settings, Tag } from "lucide-react";

export type DashboardConfig = {
  title: string;
  href: string;
  icon: LucideIcon;
}[];

export const dashboardConfig: DashboardConfig = [
  {
    title: "Meta Login",
    href: "/meta-login",
    icon: KeyRound,
  },
  {
    title: "Event Rules",
    href: "/follow-ups",
    icon: FileText,
  },
  {
    title: "Catalogs",
    href: "/catalogs",
    icon: BookOpen,
  },
  {
    title: "Custom Attributes",
    href: "/custom-attributes",
    icon: Settings,
  },
  {
    title: "Tags",
    href: "/tags",
    icon: Tag,
  },
];
