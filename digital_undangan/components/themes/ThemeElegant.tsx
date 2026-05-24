"use client";

import type { ClientData } from "@/types";
import { formatDate } from "@/lib/utils";
import { DriveImage } from "@/components/ui/DriveImage";
import { RsvpForm } from "@/components/ui/RsvpForm";

// ---------------------------------------------------------------------------
// Theme: Elegant
// ---------------------------------------------------------------------------
// A refined, minimal design with serif typography, soft rose & gold palette,
// and smooth entrance animations. Suitable for formal / classic weddings.
// ---------------------------------------------------------------------------

export function ThemeElegant({ data }: { data: ClientData }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-gray-800">
      {/* ── Hero / Cover Section ──────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Background decorative circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse" />

        {/* Cover photo */}
        {data.url_foto_cover && (
          <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-rose-200/50 mb-8 animate-fade-in">
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
          <p className="text-sm tracking-[0.3em] uppercase text-rose-400 mb-4 font-light">
            The Wedding of
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-rose-700 via-rose-500 to-amber-600 bg-clip-text text-transparent leading-tight">
            {data.nama_pria}
          </h1>
          <p className="text-3xl md:text-4xl font-serif text-amber-500 my-2">&amp;</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-amber-600 via-rose-500 to-rose-700 bg-clip-text text-transparent leading-tight">
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
            className="text-rose-300"
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
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300" />
            <span className="text-rose-400 text-2xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300" />
          </div>

          <h2 className="text-sm tracking-[0.3em] uppercase text-rose-400 mb-2 font-light">
            Akad Nikah
          </h2>
          <p className="text-2xl md:text-3xl font-serif font-semibold text-gray-800 mb-4">
            {formatDate(data.tanggal_akad)}
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-rose-400"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-gray-600">{data.lokasi_akad}</span>
          </div>
        </div>
      </section>

      {/* ── RSVP Section ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-rose-50/50 to-transparent">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-sm tracking-[0.3em] uppercase text-rose-400 mb-2 font-light">
              Konfirmasi Kehadiran
            </h2>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-gray-800">
              RSVP
            </p>
          </div>

          <RsvpForm slug={data.slug} />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-10 text-center text-sm text-gray-400">
        <p>
          Made with 💕 for {data.nama_pria} &amp; {data.nama_wanita}
        </p>
      </footer>
    </div>
  );
}
