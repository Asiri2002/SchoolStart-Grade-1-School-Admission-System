// theme/index.js

// ─────────────────────────────────────────────────────────────────────────────
// SchoolStart Design System
// Single source of truth for colours, typography, spacing, radius and shadows
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Primary
  primary: "#2563EB",
  primaryDark: "#0D47A1",
  primaryLight: "#EFF6FF",

  // Background / surfaces
  background: "#FFFFFF",
  card: "#FFFFFF",
  inputBg: "#FFFFFF",
  surfaceGray: "#F1F5F9",

  // Text
  textPrimary: "#1E293B",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  placeholder: "#9CA3AF",

  // Borders
  border: "#E2E8F0",

  // Basic
  white: "#FFFFFF",

  // Feedback
  error: "#EF4444",
  errorLight: "#FEE2E2",
  success: "#22C55E",

  // Application status colours
  statusColor: {
    UNDER_REVIEW: "#D97706",
    INTERVIEW_SCHEDULED: "#2563EB",
    SUBMITTED: "#475569",
    ACCEPTED: "#059669",
    APPROVED: "#059669",
    REJECTED: "#DC2626",
    CANCELLED: "#6B7280",
  },

  // Application status backgrounds
  statusBg: {
    UNDER_REVIEW: "#FEF3C7",
    INTERVIEW_SCHEDULED: "#EFF6FF",
    SUBMITTED: "#F1F5F9",
    ACCEPTED: "#D1FAE5",
    APPROVED: "#D1FAE5",
    REJECTED: "#FEE2E2",
    CANCELLED: "#F3F4F6",
  },

  // Avatar background colours
  avatarBg: ["#FEF3C7", "#DCFCE7", "#E0F2FE", "#F3E8FF"],

  // Avatar foreground colours
  avatarFg: ["#92400E", "#065F46", "#0369A1", "#6B21A8"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────────────────────

export const TYPOGRAPHY = {
  // Font families
  fontRegular: "System",
  fontMedium: "System",
  fontSemiBold: "System",
  fontBold: "System",

  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,

  // Font weights
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
};

// ─────────────────────────────────────────────────────────────────────────────
// Spacing
// ─────────────────────────────────────────────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ─────────────────────────────────────────────────────────────────────────────
// Border Radius
// ─────────────────────────────────────────────────────────────────────────────

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 9999,
};

// ─────────────────────────────────────────────────────────────────────────────
// Shadows
// ─────────────────────────────────────────────────────────────────────────────

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Status labels
// Backend enum → User-readable text
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_LABELS = {
  UNDER_REVIEW: "Under Review",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SUBMITTED: "Submitted",
  ACCEPTED: "Accepted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

// ─────────────────────────────────────────────────────────────────────────────
// Status helpers
// ─────────────────────────────────────────────────────────────────────────────

export const getStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }

  return STATUS_LABELS[status] || status;
};

export const getStatusColor = (status) => {
  if (!status) {
    return COLORS.textSecondary;
  }

  return COLORS.statusColor[status] || COLORS.textSecondary;
};

export const getStatusBg = (status) => {
  if (!status) {
    return COLORS.border;
  }

  return COLORS.statusBg[status] || COLORS.border;
};

// ─────────────────────────────────────────────────────────────────────────────
// Avatar helpers
// ─────────────────────────────────────────────────────────────────────────────

export const getAvatarBg = (index) => {
  return COLORS.avatarBg[index % COLORS.avatarBg.length];
};

export const getAvatarFg = (index) => {
  return COLORS.avatarFg[index % COLORS.avatarFg.length];
};

// ─────────────────────────────────────────────────────────────────────────────
// Complete theme
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
};

export default theme;
