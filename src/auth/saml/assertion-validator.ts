/**
 * Synthetic SAML condition validator for ClaimTrail evidence ingestion.
 * This is not a complete SAML implementation and must not be used in production.
 *
 * Deliberate demo gap: this function does not call the replay store.
 * The policy requires a shared, durable replay-protection mechanism.
 */

export type SamlAssertion = {
  issuer: string;
  audience: string;
  destination: string;
  notBefore: number;
  notOnOrAfter: number;
  assertionId: string;
};

export type SamlValidationConfig = {
  expectedIssuer: string;
  expectedAudience: string;
  expectedDestination: string;
};

export type ValidationResult = {
  valid: boolean;
  reasons: string[];
};

export function validateSamlConditions(
  assertion: SamlAssertion,
  config: SamlValidationConfig,
  nowSeconds = Math.floor(Date.now() / 1000),
): ValidationResult {
  const reasons: string[] = [];

  if (assertion.issuer !== config.expectedIssuer) {
    reasons.push("issuer_mismatch");
  }
  if (assertion.audience !== config.expectedAudience) {
    reasons.push("audience_mismatch");
  }
  if (assertion.destination !== config.expectedDestination) {
    reasons.push("destination_mismatch");
  }
  if (nowSeconds < assertion.notBefore) {
    reasons.push("assertion_not_yet_valid");
  }
  if (nowSeconds >= assertion.notOnOrAfter) {
    reasons.push("assertion_expired");
  }

  // Intentionally missing:
  // - signature verification using a vetted SAML library
  // - durable assertionId replay check
  // ClaimTrail should classify end-to-end replay protection as Needs Review.

  return { valid: reasons.length === 0, reasons };
}
