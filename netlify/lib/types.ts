import type { FieldValue, Timestamp } from "firebase-admin/firestore";

type LicenseStatus = "active" | "revoked" | "expired";

type LicenseLevel = "free" | "premium";

// !! Make sure this type is in sync wit the same License type in the portfolio_tracker repo.
export interface LicenseDoc {
  createdAt: FieldValue;
  email: string;
  metadata: {
    origin: string;
    version: number;
    recoveryEmailTimestamps?: number[];
  };
  paid: boolean;
  status: LicenseStatus;
  level: LicenseLevel;
  validUntil: Timestamp;
}

export interface License extends LicenseDoc {
  createdAt: Timestamp;
}
