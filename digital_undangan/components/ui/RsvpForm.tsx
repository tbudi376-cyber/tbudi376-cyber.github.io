"use client";

import { useState, useCallback } from "react";
import { submitRsvp } from "@/lib/api";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { RsvpPayload } from "@/types";

// ---------------------------------------------------------------------------
// RsvpForm — RSVP Form with Optimistic UI
// ---------------------------------------------------------------------------
// When the user submits:
//   1. IMMEDIATELY: clear the form, add entry to the guestbook list,
//      and show a success toast ("Pesan terkirim!")
//   2. BACKGROUND: execute the actual fetch POST to Google Apps Script
//   3. ON FAILURE: show an error toast (but don't remove the entry —
//      the user already saw it)
//
// This makes the app feel instant despite GAS taking 1-3 seconds to respond.
// ---------------------------------------------------------------------------

interface RsvpFormProps {
  /** Wedding slug for tagging RSVP entries */
  slug: string;
  /** Visual variant to match the active theme */
  variant?: "elegant" | "rustic";
}

interface GuestbookEntry {
  id: string;
  nama_tamu: string;
  kehadiran: "Hadir" | "Tidak Hadir";
  pesan: string;
  timestamp: string;
}

export function RsvpForm({ slug, variant = "elegant" }: RsvpFormProps) {
  // Form state
  const [nama, setNama] = useState("");
  const [kehadiran, setKehadiran] = useState<"Hadir" | "Tidak Hadir">("Hadir");
  const [pesan, setPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guestbook (optimistic entries)
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, toastVariant: "success" | "error" = "success") => {
      setToast({ message, variant: toastVariant });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !pesan.trim()) return;

    // Capture current values before clearing
    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      nama_tamu: nama.trim(),
      kehadiran,
      pesan: pesan.trim(),
      timestamp: new Date().toLocaleString("id-ID"),
    };

    const payload: RsvpPayload = {
      slug,
      nama_tamu: entry.nama_tamu,
      kehadiran: entry.kehadiran,
      pesan: entry.pesan,
    };

    // ── Step 1: Optimistic update (instant) ──
    setGuestbook((prev) => [entry, ...prev]);
    setNama("");
    setPesan("");
    setKehadiran("Hadir");
    showToast("Pesan terkirim! ✨");
    setIsSubmitting(true);

    // ── Step 2: Background POST to GAS ──
    try {
      const success = await submitRsvp(payload);
      if (!success) {
        showToast("Gagal mengirim pesan, coba lagi nanti", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme-adaptive styles
  const isRustic = variant === "rustic";
  const accentColor = isRustic ? "green" : "rose";

  return (
    <div>
      {/* ── Form ──────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "p-6 md:p-8 rounded-3xl border backdrop-blur-sm",
          isRustic
            ? "bg-white/50 border-green-200/40"
            : "bg-white/60 border-rose-200/40"
        )}
      >
        {/* Name field */}
        <div className="mb-5">
          <label
            htmlFor="rsvp-nama"
            className={cn(
              "block text-sm font-medium mb-2",
              isRustic ? "text-stone-600" : "text-gray-600"
            )}
          >
            Nama Anda
          </label>
          <input
            id="rsvp-nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Masukkan nama lengkap"
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white/80 outline-none transition-all duration-200",
              "placeholder:text-gray-300 text-gray-700",
              isRustic
                ? "border-green-200/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                : "border-rose-200/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
            )}
          />
        </div>

        {/* Attendance radio */}
        <div className="mb-5">
          <label
            className={cn(
              "block text-sm font-medium mb-3",
              isRustic ? "text-stone-600" : "text-gray-600"
            )}
          >
            Kehadiran
          </label>
          <div className="flex gap-4">
            {(["Hadir", "Tidak Hadir"] as const).map((option) => (
              <label
                key={option}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200",
                  kehadiran === option
                    ? isRustic
                      ? "bg-green-50 border-green-400 text-green-700 shadow-sm"
                      : "bg-rose-50 border-rose-400 text-rose-700 shadow-sm"
                    : "bg-white/60 border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                <input
                  type="radio"
                  name="kehadiran"
                  value={option}
                  checked={kehadiran === option}
                  onChange={() => setKehadiran(option)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">
                  {option === "Hadir" ? "✅ Hadir" : "❌ Tidak Hadir"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Message textarea */}
        <div className="mb-6">
          <label
            htmlFor="rsvp-pesan"
            className={cn(
              "block text-sm font-medium mb-2",
              isRustic ? "text-stone-600" : "text-gray-600"
            )}
          >
            Ucapan & Doa
          </label>
          <textarea
            id="rsvp-pesan"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            required
            rows={3}
            placeholder="Tulis ucapan dan doa untuk mempelai..."
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white/80 outline-none transition-all duration-200 resize-none",
              "placeholder:text-gray-300 text-gray-700",
              isRustic
                ? "border-green-200/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                : "border-rose-200/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
            )}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !nama.trim() || !pesan.trim()}
          className={cn(
            "w-full py-3.5 rounded-xl font-medium text-white transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-lg active:scale-[0.98]",
            isRustic
              ? `bg-green-600 hover:bg-green-700 shadow-green-600/25`
              : `bg-rose-500 hover:bg-rose-600 shadow-rose-500/25`
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Mengirim...
            </span>
          ) : (
            "Kirim Ucapan 💌"
          )}
        </button>
      </form>

      {/* ── Guestbook (Optimistic Entries) ────────────────────────── */}
      {guestbook.length > 0 && (
        <div className="mt-10">
          <h3
            className={cn(
              "text-center text-sm tracking-[0.2em] uppercase mb-6 font-light",
              isRustic ? "text-green-600/70" : "text-rose-400"
            )}
          >
            Ucapan Tamu
          </h3>

          <div className="space-y-4">
            {guestbook.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "p-4 rounded-2xl border backdrop-blur-sm animate-fade-in-up",
                  isRustic
                    ? "bg-white/40 border-green-200/30"
                    : "bg-white/50 border-rose-200/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      isRustic ? "text-stone-700" : "text-gray-700"
                    )}
                  >
                    {entry.nama_tamu}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      entry.kehadiran === "Hadir"
                        ? isRustic
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-600"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {entry.kehadiran}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    isRustic ? "text-stone-600" : "text-gray-600"
                  )}
                >
                  {entry.pesan}
                </p>
                <p className="text-xs text-gray-400 mt-2">{entry.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
