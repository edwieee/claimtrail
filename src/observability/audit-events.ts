/**
 * Safe audit-event shape for synthetic demo use.
 * Callers must not include secrets, passwords, cookies, or bearer tokens.
 */

export type AuditOutcome = "success" | "denied" | "failure";

export type AuditEvent = {
  timestamp: string;
  actorId: string;
  action: string;
  outcome: AuditOutcome;
  resourceType?: string;
  resourceId?: string;
  correlationId?: string;
};

const SECRET_FIELD_NAMES = new Set([
  "password",
  "token",
  "access_token",
  "refresh_token",
  "authorization",
  "cookie",
  "private_key",
]);

export function removeSecretFields(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const safe: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!SECRET_FIELD_NAMES.has(key.toLowerCase())) {
      safe[key] = value;
    }
  }

  return safe;
}

export function createAuditEvent(
  event: AuditEvent,
): AuditEvent {
  return {
    timestamp: event.timestamp,
    actorId: event.actorId,
    action: event.action,
    outcome: event.outcome,
    ...(event.resourceType ? { resourceType: event.resourceType } : {}),
    ...(event.resourceId ? { resourceId: event.resourceId } : {}),
    ...(event.correlationId ? { correlationId: event.correlationId } : {}),
  };
}
