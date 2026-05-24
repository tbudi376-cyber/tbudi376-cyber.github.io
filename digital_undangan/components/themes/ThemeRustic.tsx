"use client";

import type { ClientData } from "@/types";
import { formatDate } from "@/lib/utils";
import { DriveImage } from "@/components/ui/DriveImage";
import { RsvpForm } from "@/components/ui/RsvpForm";

// ---------------------------------------------------------------------------
// Theme: Rustic
// ---------------------------------------------------------------------------
// A warm, earthy design with natural wood tones, sage green accents,
// and organic shapes. Suitable for garden / outdoor / bohemian weddings.
// ---------------------------------------------------------------------------

export function ThemeRustic({ data }: { data: ClientData }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-green-50/30 text-stone-800">
      {/* ── Hero / Cover Section ──────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Background organic shapes */}
        <div className="absolute top-20 -left-10 w-80 h-80 bg-green-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

        {/* Decorative leaf line */}
        <p className="text-sm tracking-[0.25em] uppercase text-green-600/60 mb-6 font-light animate-fade-in">
          🌿 You are cordially invited 🌿
        </p>

        {/* Cover photo */}
        {data.url_foto_cover && (
          <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-3xl overflow-hidden border-2 border-amber-200/60 shadow-2xl shadow-amber-900/10 mb-8 animate-fade-in">
            <DriveImage
              url={data.url_foto_cover}
              alt={`Foto ${data.nama_pria} & ${data.nama_wanita}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Names */}
        <div className="text-center animate-fade-in-up relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-700 leading-tight">
            {data.nama_pria}
          </h1>
          <div className="flex items-center justify-center gap-4 my-3">
            <div className="h-px w-12 bg-green-600/30" />
            <span className="text-green-600 text-lg font-serif italic">and</span>
            <div className="h-px w-12 bg-green-600/30" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-700 leading-tight">
            {data.nama_wanita}
          </h1>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-green-400"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Event Details Section ─────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-300" />
            <span className="text-green-500 text-xl">🍃</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-300" />
          </div>

          <h2 className="text-sm tracking-[0.25em] uppercase text-green-600/70 mb-2 font-light">
            Akad Nikah
          </h2>
          <p className="text-2xl md:text-3xl font-serif font-semibold text-stone-700 mb-4">
            {formatDate(data.tanggal_akad)}
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-green-500"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-stone-600">{data.lokasi_akad}</span>
          </div>
        </div>
      </section>

      {/* ── RSVP Section ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-green-50/40 to-transparent">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-sm tracking-[0.25em] uppercase text-green-600/70 mb-2 font-light">
              Konfirmasi Kehadiran
            </h2>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-stone-700">
              RSVP
            </p>
          </div>

          <RsvpForm slug={data.slug} variant="rustic" />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-10 text-center text-sm text-stone-400">
        <p>
          Made with 🌿 for {data.nama_pria} &amp; {data.nama_wanita}
        </p>
      </footer>
    </div>
  );
}
