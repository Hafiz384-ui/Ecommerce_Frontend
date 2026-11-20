interface Coupon {
  _id?: string;
  code: string;
  discountValue: number;
  expiryDate: Date | string;
  isActive: boolean;
  isUsed?: boolean;
  isExpired?: boolean;
  status?: "ACTIVE" | "USED" | "EXPIRED" | "DISABLED";
  statusLabel?: string;
}

export type { Coupon };
