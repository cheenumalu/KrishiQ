import { Request, Response, NextFunction } from "express";
import { supabase, supabaseAdmin } from "../config/supabase";
import { UserRole } from "../types/auth";

/**
 * Authentication Middleware
 * Validates Supabase JWT access tokens from Authorization Bearer header,
 * extracts user identity, queries role and profile from PostgreSQL,
 * and attaches AuthenticatedUser to req.user.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Error Case: Missing Authorization Header
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization token required. Please provide a Bearer token in the Authorization header.",
      });
      return;
    }

    // 2. Error Case: Malformed Authorization Header
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Malformed authorization header. Expected format: 'Bearer <token>'.",
      });
      return;
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authorization token required. Token value cannot be empty.",
      });
      return;
    }

    // 3. Cryptographically Validate Token with Supabase Auth Engine
    const { data: authData, error: authError } = await supabase.auth.getUser(token);


    if (authError || !authData.user) {
      const errorMsg = authError?.message?.toLowerCase() || "";
      
      // Expired Session
      if (errorMsg.includes("expired") || errorMsg.includes("jwt expired")) {
        res.status(401).json({
          success: false,
          message: "Authentication session has expired. Please log in again.",
        });
        return;
      }

      // Invalid Token
      res.status(401).json({
        success: false,
        message: "Invalid or unauthorized access token.",
      });
      return;
    }

    const authUser = authData.user;

    // 5. Query User Profile & Role from Public PostgreSQL Database
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        phone,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at,
        farmers (
          id,
          farmer_id_code,
          village,
          tehsil,
          district,
          state,
          aadhaar_verified,
          bank_name,
          account_number_mask,
          ifsc_prefix,
          max_allotment_quintals
        )
      `)
      .or(`id.eq.${authUser.id},phone.eq.${authUser.phone || "none"},email.eq.${authUser.email || "none"}`)
      .limit(1)
      .maybeSingle();

    if (dbError) {
      console.error("[AuthMiddleware] Database lookup error:", dbError);
    }

    // Check Account Status
    if (dbUser && !dbUser.is_active) {
      res.status(403).json({
        success: false,
        message: "Account has been deactivated. Please contact APMC administration.",
      });
      return;
    }

    // 6. Map and Attach Identity to req.user
    if (dbUser) {
      const farmerData = Array.isArray(dbUser.farmers)
        ? dbUser.farmers[0]
        : dbUser.farmers;

      req.user = {
        id: dbUser.id,
        phone: dbUser.phone,
        email: dbUser.email,
        fullName: dbUser.full_name,
        role: dbUser.role as UserRole,
        isActive: dbUser.is_active,
        farmerProfile: farmerData
          ? {
              id: farmerData.id,
              farmerIdCode: farmerData.farmer_id_code,
              village: farmerData.village,
              tehsil: farmerData.tehsil,
              district: farmerData.district,
              state: farmerData.state,
              aadhaarVerified: farmerData.aadhaar_verified,
              bankName: farmerData.bank_name,
              accountNumberMask: farmerData.account_number_mask,
              ifscPrefix: farmerData.ifsc_prefix,
              maxAllotmentQuintals: Number(farmerData.max_allotment_quintals),
            }
          : null,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
      };
    } else {
      // Fallback to Supabase Auth metadata if DB record is not yet provisioned
      req.user = {
        id: authUser.id,
        phone: authUser.phone || "",
        email: authUser.email || null,
        fullName:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "Registered User",
        role: (authUser.user_metadata?.role as UserRole) || "farmer",
        isActive: true,
        farmerProfile: null,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};
