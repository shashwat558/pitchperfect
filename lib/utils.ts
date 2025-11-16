import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))

}
export const PATTERNS = {

  diagonalElegant:
    "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 5px)",


  verticalSoft:
    "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 18px)",


  gridMinimal:
    "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",


  dots:
    "radial-gradient(currentColor 1px, transparent 1px)",

  wave:
    "repeating-linear-gradient(120deg, currentColor 0 2px, transparent 2px 18px)",
};

