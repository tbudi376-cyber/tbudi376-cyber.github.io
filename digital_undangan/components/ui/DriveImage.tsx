import Image from "next/image";
import { getDriveImageUrl } from "@/lib/utils";

// ---------------------------------------------------------------------------
// DriveImage — Google Drive Image Wrapper
// ---------------------------------------------------------------------------
// Wraps next/image to handle Google Drive URLs:
//   1. Extracts the file ID from various Drive URL formats
//   2. Converts to a direct-view URL compatible with next/image
//   3. Serves via Vercel's Image Optimization (Edge CDN)
//
// This protects your Google Drive from being rate-limited by high traffic —
// images are cached and served from Vercel's edge network.
// ---------------------------------------------------------------------------

interface DriveImageProps {
  /** Raw Google Drive URL (any format) or a direct image URL */
  url: string;
  /** Alt text for accessibility */
  alt: string;
  /** Use fill mode (parent must be position: relative) */
  fill?: boolean;
  /** Fixed width (ignored if fill is true) */
  width?: number;
  /** Fixed height (ignored if fill is true) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Prioritize loading (use for above-the-fold images) */
  priority?: boolean;
  /** Responsive sizes attribute for srcset optimization */
  sizes?: string;
}

export function DriveImage({
  url,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: DriveImageProps) {
  // Convert Drive URL to direct image URL
  const imageUrl = getDriveImageUrl(url);

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        unoptimized={false}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={false}
    />
  );
}
