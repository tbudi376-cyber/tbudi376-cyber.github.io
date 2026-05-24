import Link from "next/link";

// ---------------------------------------------------------------------------
// Custom 404 — Invitation Not Found
// ---------------------------------------------------------------------------
// Shown when a slug doesn't match any client in the database.
// Uses elegant styling consistent with a wedding invitation platform.
// ---------------------------------------------------------------------------

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="text-center px-6 max-w-md">
        {/* Decorative element */}
        <div className="mb-6">
          <span className="text-6xl">💌</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-3">
          Undangan Tidak Ditemukan
        </h1>

        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Maaf, undangan pernikahan yang Anda cari tidak tersedia atau link
          mungkin sudah tidak berlaku.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors duration-200 shadow-lg shadow-rose-500/25"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
