"use client";

import type { ClientData } from "@/types";
import { ThemeElegant } from "./ThemeElegant";
import { ThemeRustic } from "./ThemeRustic";
import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// ThemeRenderer — Maps theme_id to the correct theme component
// ---------------------------------------------------------------------------
// Add new themes by:
//   1. Creating a new component in components/themes/
//   2. Adding it to the THEME_MAP below
//   3. Using the key as the theme_id in your Google Sheet
// ---------------------------------------------------------------------------

interface ThemeProps {
  data: ClientData;
}

/**
 * Registry of all available wedding invitation themes.
 * The key must match the `theme_id` value stored in Google Sheets.
 */
const THEME_MAP: Record<string, ComponentType<ThemeProps>> = {
  elegant: ThemeElegant,
  rustic: ThemeRustic,
};

/**
 * Default fallback theme if theme_id doesn't match any registered theme.
 */
const DEFAULT_THEME = "elegant";

export function ThemeRenderer({ data }: ThemeProps) {
  const themeId = data.theme_id?.toLowerCase().trim() || DEFAULT_THEME;
  const ThemeComponent = THEME_MAP[themeId] || THEME_MAP[DEFAULT_THEME];

  return <ThemeComponent data={data} />;
}
