/**
 * Theme constants extracted from the Cyber-Nexus design system.
 * These match the Stitch design screens exactly.
 * 
 * Color palette: Dark background with cyan + fuchsia/purple accents
 * Fonts: Space Grotesk (headlines) + Inter (body text)
 */

export const COLORS = {
  // ---- Background & Surface Colors ----
  background: '#0e0e0e',           // Main dark background
  surface: '#0e0e0e',              // Same as background
  surfaceContainer: '#1a1919',     // Slightly lighter cards
  surfaceContainerLow: '#131313',  // Very subtle card variant
  surfaceContainerHigh: '#201f1f', // Elevated surface
  surfaceContainerHighest: '#262626', // Highest elevation
  surfaceContainerLowest: '#000000', // Pure black

  // ---- Primary (Cyan) ----
  primary: '#8ff5ff',              // Main cyan accent
  primaryContainer: '#00eefc',     // Brighter cyan
  primaryDim: '#00deec',           // Slightly muted cyan
  onPrimary: '#005d63',            // Text on primary background
  onPrimaryContainer: '#005359',   // Text on primary container

  // ---- Secondary (Purple/Fuchsia) ----
  secondary: '#d575ff',            // Main purple accent
  secondaryContainer: '#9800d0',   // Deep purple
  secondaryDim: '#b90afc',         // Vibrant purple
  onSecondary: '#390050',          // Text on secondary
  onSecondaryContainer: '#fff5fc', // Text on secondary container

  // ---- Tertiary ----
  tertiary: '#9dfaff',
  tertiaryContainer: '#72eff5',

  // ---- Error ----
  error: '#ff716c',
  errorContainer: '#9f0519',
  onError: '#490006',

  // ---- Text Colors ----
  onBackground: '#ffffff',         // White text on dark bg
  onSurface: '#ffffff',            // White text on surfaces
  onSurfaceVariant: '#adaaaa',     // Muted text for descriptions

  // ---- Borders & Outlines ----
  outline: '#777575',
  outlineVariant: '#494847',

  // ---- Special Purpose ----
  whatsappGreen: '#25D366',        // WhatsApp brand color for checkout button
  whatsappDark: '#128C7E',         // Darker WhatsApp variant

  // ---- Glass Morphism ----
  glassBg: 'rgba(38, 38, 38, 0.4)',     // Semi-transparent glass background
  glassBorder: 'rgba(143, 245, 255, 0.1)', // Subtle cyan glass border
} as const;

/**
 * Typography configuration.
 * We use system fonts as fallbacks since custom fonts need to be loaded.
 */
export const FONTS = {
  headline: 'SpaceGrotesk',        // Bold, uppercase headings
  body: 'Inter',                   // Regular body text
  label: 'SpaceGrotesk',          // Small label text
} as const;

/**
 * Spacing scale (in pixels).
 * Consistent spacing makes the UI feel professional.
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border radius values.
 * Slightly rounded corners give a modern feel.
 */
export const RADIUS = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

/**
 * Shadow/glow presets for the neon aesthetic.
 */
export const SHADOWS = {
  // Cyan glow for primary elements
  cyanGlow: {
    shadowColor: '#8ff5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  // Purple glow for secondary elements
  purpleGlow: {
    shadowColor: '#d575ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  // WhatsApp button glow
  whatsappGlow: {
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
