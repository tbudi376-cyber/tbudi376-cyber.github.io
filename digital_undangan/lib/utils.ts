import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into Indonesian locale format.
 * Example: "2026-06-15" → "Minggu, 15 Juni 2026"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Extract a Google Drive file ID from various URL formats.
 *
 * Supported formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=view
 * - https://drive.usercontent.google.com/download?id=FILE_ID
 * - Just the raw FILE_ID string
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;

  // Pattern 1: /file/d/FILE_ID/
  const filePattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) return fileMatch[1];

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const idMatch = url.match(idPattern);
  if (idMatch) return idMatch[1];

  // Pattern 3: If the string itself looks like a file ID (no slashes or dots)
  const rawIdPattern = /^[a-zA-Z0-9_-]{20,}$/;
  if (rawIdPattern.test(url)) return url;

  return null;
}

/**
 * Convert a Google Drive file ID to a direct viewable image URL.
 * This format works with next/image optimization.
 */
export function getDriveImageUrl(fileIdOrUrl: string): string {
  const fileId = extractDriveFileId(fileIdOrUrl);
  if (!fileId) return fileIdOrUrl; // fallback to original URL

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}
