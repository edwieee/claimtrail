/**
 * Example retention values mirroring config/data-retention.yaml.
 * These values are illustrative and are not proof of deletion enforcement.
 */

export type RetentionCategory =
  | "application_logs"
  | "security_audit_events"
  | "user_uploaded_documents"
  | "backup_data";

export const RETENTION_DAYS: Record<RetentionCategory, number> = {
  application_logs: 90,
  security_audit_events: 365,
  user_uploaded_documents: 30,
  backup_data: 7,
};

export function isRetentionPeriodConfigured(
  category: RetentionCategory,
): boolean {
  return Number.isInteger(RETENTION_DAYS[category]) && RETENTION_DAYS[category] > 0;
}
