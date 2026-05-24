// ============================================================
// Digital Wedding Invitation Platform — Type Definitions
// ============================================================

/**
 * Client data from the "DataKlien" Google Sheets tab.
 * Each row represents one wedding invitation client.
 */
export interface ClientData {
  slug: string;
  theme_id: string;
  nama_pria: string;
  nama_wanita: string;
  tanggal_akad: string;
  lokasi_akad: string;
  url_foto_cover: string;
}

/**
 * A single RSVP entry from the "RSVP" Google Sheets tab.
 */
export interface RsvpEntry {
  slug: string;
  nama_tamu: string;
  kehadiran: "Hadir" | "Tidak Hadir";
  pesan: string;
  timestamp: string;
}

/**
 * Payload sent via POST to Google Apps Script
 * when a guest submits the RSVP form.
 */
export interface RsvpPayload {
  slug: string;
  nama_tamu: string;
  kehadiran: "Hadir" | "Tidak Hadir";
  pesan: string;
}

/**
 * Generic response wrapper from Google Apps Script Web App.
 * T is the data type returned on success.
 */
export interface GASResponse<T = unknown> {
  status: "success" | "error";
  data?: T;
  message?: string;
}
