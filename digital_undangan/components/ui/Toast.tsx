"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Toast — Lightweight Notification Component
// ---------------------------------------------------------------------------
// Slides in from the bottom with a fade, auto-dismisses after duration.
// Supports "success" and "error" variants.
// ---------------------------------------------------------------------------

interface ToastProps {
  /** The message to display */
  message: string;
  /** Visual style variant */
  variant?: "success" | "error";
  /** Auto-dismiss duration in milliseconds */
  duration?: number;
  /** Callback when toast is dismissed */
  onClose: () => void;
}

export function Toast({
  message,
  variant = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to finish before removing from DOM
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "px-6 py-3 rounded-2xl shadow-lg backdrop-blur-sm",
        "text-sm font-medium",
        "transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        variant === "success" &&
          "bg-green-500/90 text-white shadow-green-500/25",
        variant === "error" &&
          "bg-red-500/90 text-white shadow-red-500/25"
      )}
    >
      <span className="flex items-center gap-2">
        {variant === "success" ? "✨" : "⚠️"}
        {message}
      </span>
    </div>
  );
}
