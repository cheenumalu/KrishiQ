/**
 * Request Validation Schemas Foundation
 *
 * In subsequent phases, schema validation (e.g. Zod or Joi) will be defined here
 * for validating request payloads (bookings, quality assays, weighments, etc.)
 * before they reach the controllers.
 */

export interface ValidationResult<T> {
  isValid: boolean;
  errors?: string[];
  value?: T;
}
