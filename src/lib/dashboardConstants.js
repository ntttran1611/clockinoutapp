// Modal IDs
export const MODAL_IDS = {
  CLOCK_IN_ALERT: "clockInAlert",
  CLOCK_OUT_ALERT: "clockOutAlert",
};

// Alert Configuration
export const ALERT_CONFIG = {
  CLOCK_IN: {
    heading: "Attention before action",
    color: "sky-mist-100",
  },
  CLOCK_OUT: {
    heading: "Attention before action",
    color: "alert",
  },
};

// Clock-out Methods
export const CLOCK_OUT_METHODS = {
  AUTO_GENERATED: "auto-generated",
  ADMIN_VERIFIED: "admin-verified",
};

// CSS Classes for Clock-out Method
export const CLOCKOUT_METHOD_CLASSES = {
  [CLOCK_OUT_METHODS.AUTO_GENERATED]: "text-alert",
  [CLOCK_OUT_METHODS.ADMIN_VERIFIED]: "text-sky-mist-100",
  DEFAULT: "text-text-primary",
};

// Table Headers
export const TABLE_HEADERS = [
  "Clock In Date",
  "Clock In At",
  "Clock Out Date",
  "Clock Out At",
  "Total Hours",
  "Branch",
  "Clock-out Method",
];
