/**
 * Allowed User Roles in KrishiQ Platform
 */
export type UserRole = "farmer" | "centre" | "admin";

/**
 * Farmer agricultural profile extension
 */
export interface FarmerProfile {
  id: string;
  farmerIdCode: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  aadhaarVerified: boolean;
  bankName: string;
  accountNumberMask: string;
  ifscPrefix: string;
  maxAllotmentQuintals: number;
}

/**
 * Authenticated User object attached to req.user
 */
export interface AuthenticatedUser {
  id: string;
  phone: string;
  email: string | null;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  farmerProfile?: FarmerProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Express Request Type Augmentation
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
