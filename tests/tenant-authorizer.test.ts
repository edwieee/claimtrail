import { describe, expect, it } from "vitest";
import { authorizeTenantResource } from "../src/tenancy/tenant-authorizer";

describe("authorizeTenantResource", () => {
  const resource = { id: "record-1", tenantId: "tenant-a" };

  it("allows access when authenticated tenant matches resource tenant", () => {
    const principal = { userId: "user-1", tenantId: "tenant-a", roles: ["member"] };
    expect(authorizeTenantResource(principal, resource).allowed).toBe(true);
  });

  it("denies access when tenant IDs differ", () => {
    const principal = { userId: "user-2", tenantId: "tenant-b", roles: ["member"] };
    expect(authorizeTenantResource(principal, resource).allowed).toBe(false);
  });

  it("denies access when principal context is missing", () => {
    expect(authorizeTenantResource(null, resource).allowed).toBe(false);
  });
});
