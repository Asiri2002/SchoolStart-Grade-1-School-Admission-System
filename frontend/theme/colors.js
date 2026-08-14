// theme/index.js

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — single source of truth for all colours in the app
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  primary: "#1565C0",
  primaryDark: "#0D47A1",
  primaryLight: "#E3F2FD",

  background: "#F5F7FA",
  card: "#FFFFFF",

  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#EFF3F8",
  white: "#FFFFFF",

  statusColor: {
    UNDER_REVIEW: "#D97706",
    INTERVIEW_SCHEDULED: "#2563EB",
    SUBMITTED: "#475569",
    ACCEPTED: "#059669",
    APPROVED: "#059669",
    REJECTED: "#DC2626",
    CANCELLED: "#6B7280",
  },

  statusBg: {
    UNDER_REVIEW: "#FEF3C7",
    INTERVIEW_SCHEDULED: "#EFF6FF",
    SUBMITTED: "#F1F5F9",
    ACCEPTED: "#D1FAE5",
    APPROVED: "#D1FAE5",
    REJECTED: "#FEE2E2",
    CANCELLED: "#F3F4F6",
  },

  avatarBg: ["#FEF3C7", "#DCFCE7", "#E0F2FE", "#F3E8FF"],
  avatarFg: ["#92400E", "#065F46", "#0369A1", "#6B21A8"],
};

export const STATUS_LABELS = {
  UNDER_REVIEW: "Under Review",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SUBMITTED: "Submitted",
  ACCEPTED: "Accepted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const getStatusLabel = (status) =>
  STATUS_LABELS[status] ?? status ?? "Unknown";

export const getStatusColor = (status) =>
  COLORS.statusColor[status] ?? COLORS.textSecondary;

export const getStatusBg = (status) => COLORS.statusBg[status] ?? COLORS.border;
