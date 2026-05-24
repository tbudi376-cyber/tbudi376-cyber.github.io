import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getClientData } from "@/lib/api";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";

// ---------------------------------------------------------------------------
// Dynamic Invitation Page — Server Component with ISR
// ---------------------------------------------------------------------------
// Each wedding client gets a unique slug (e.g., /andi-nina).
// This page fetches their data from GAS, caches it for 5 minutes (ISR),
// and renders the appropriate theme component.
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic SEO metadata based on the client's data.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getClientData(slug);

  if (!data) {
    return {
      title: "Undangan Tidak Ditemukan",
      description: "Undangan pernikahan yang Anda cari tidak tersedia.",
    };
  }

  const title = `Undangan Pernikahan ${data.nama_pria} & ${data.nama_wanita}`;
  const description = `Anda diundang ke pernikahan ${data.nama_pria} & ${data.nama_wanita}. Mohon konfirmasi kehadiran Anda.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: data.url_foto_cover ? [data.url_foto_cover] : [],
    },
  };
}

/**
 * The main dynamic page component.
 * Fetches client data using ISR and renders the correct theme.
 */
export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const clientData = await getClientData(slug);

  if (!clientData) {
    notFound();
  }

  return <ThemeRenderer data={clientData} />;
}
