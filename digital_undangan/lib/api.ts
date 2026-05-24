// ============================================================
// Data Fetching Layer — Google Apps Script API Client
// ============================================================
// All server-side data fetching goes through this module.
// Uses ISR (Incremental Static Regeneration) with 5-minute revalidation
// to cache responses on Vercel's edge and prevent GAS rate-limiting.
// ============================================================

import type { ClientData, RsvpPayload, GASResponse } from "@/types";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

/**
 * Fetch client wedding data by slug from Google Apps Script.
 *
 * Uses ISR with `next: { revalidate: 300 }` (5 minutes) so:
 * - First request fetches from GAS and caches the result
 * - Subsequent requests within 5 min serve from cache
 * - After 5 min, Next.js revalidates in the background
 *
 * @param slug - The unique URL slug for the wedding (e.g., "andi-nina")
 * @returns ClientData object or null if not found / error
 */
export async function getClientData(
  slug: string
): Promise<ClientData | null> {
  try {
    const url = `${GAS_URL}?slug=${encodeURIComponent(slug)}`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // ISR: cache for 5 minutes
    });

    if (!res.ok) {
      console.error(
        `[getClientData] HTTP error: ${res.status} for slug "${slug}"`
      );
      return null;
    }

    const json: GASResponse<ClientData> = await res.json();

    if (json.status === "success" && json.data) {
      return json.data;
    }

    console.warn(
      `[getClientData] GAS returned error for slug "${slug}":`,
      json.message
    );
    return null;
  } catch (error) {
    console.error(`[getClientData] Fetch failed for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Submit an RSVP entry to Google Apps Script.
 *
 * Uses `Content-Type: text/plain` to send JSON body —
 * this bypasses the CORS preflight OPTIONS request that
 * Google Apps Script cannot handle.
 *
 * @param payload - The RSVP data to submit
 * @returns true on success, false on failure
 */
export async function submitRsvp(payload: RsvpPayload): Promise<boolean> {
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`[submitRsvp] HTTP error: ${res.status}`);
      return false;
    }

    const json: GASResponse = await res.json();
    return json.status === "success";
  } catch (error) {
    console.error("[submitRsvp] Fetch failed:", error);
    return false;
  }
}
