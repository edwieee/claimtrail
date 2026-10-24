/**
 * Synthetic tenant authorization helper.
 * This demonstrates one server-side ownership check, not a complete authorization system.
 */

export type AuthenticatedPrincipal = {
  userId: string;
  tenantId: string;
  roles: string[];
};

export type TenantOwnedResource = {
  id: string;
  tenantId: string;
  ownerUserId?: string;
};

export type AuthorizationDecision = {
  allowed: boolean;
  reason: "tenant_match" | "tenant_mismatch" | "missing_context";
};

export function authorizeTenantResource(
  principal: AuthenticatedPrincipal | null,
  resource: TenantOwnedResource,
): AuthorizationDecision {
  if (!principal || !principal.tenantId) {
    return { allowed: false, reason: "missing_context" };
  }

  if (principal.tenantId !== resource.tenantId) {
    return { allowed: false, reason: "tenant_mismatch" };
  }

  return { allowed: true, reason: "tenant_match" };
}
