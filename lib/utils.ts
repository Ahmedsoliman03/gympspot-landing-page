import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Base URL of the GymSpot web app ("the system") that CTAs link to.
 * Configured via NEXT_PUBLIC_APP_URL; defaults to the local dev server.
 */
export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** Build an absolute URL into the GymSpot app, locale-aware. */
export function appUrl(path = "", locale = "en") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${APP_URL}/${locale}${clean === "/" ? "" : clean}`;
}
