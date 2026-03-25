import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: string) => {
  throw new Error(error);
};

export function getContrastingTextColorClass(bgColor: string) {
  // Extract the color name and shade from the tailwind color string (e.g., "red-500")
  const match = bgColor.match(/^([a-z]+)-(\d{3})$/);
  if (!match) {
    // fallback if not a tailwind color
    return 'text-white';
  }
  const [, color, shadeStr] = match;
  const shade = parseInt(shadeStr, 10);

  // Tailwind convention: 100-400 are light, 500-900 are dark
  // We'll use 400 as the threshold: <=400 is light, >400 is dark
  const isLight = shade <= 400;

  // For some colors (like yellow, lime, amber), even 500 can be light, so handle exceptions
  const alwaysLightColors = ['yellow', 'lime', 'amber'];
  if (alwaysLightColors.includes(color) && shade <= 500) {
    return 'text-gray-900';
  }

  return isLight ? 'text-gray-900' : 'text-white';
}


export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString();
  const timePart = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} - ${timePart}`;
};
