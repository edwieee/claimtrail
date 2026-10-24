# AcmeCloud — ClaimTrail Evidence Demo

**Purpose:** Synthetic sample repository for demonstrating ClaimTrail's repository ingestion, evidence traceability, deterministic checks, and policy-versus-implementation review.

> This is an intentionally simplified fictional application. It is not production-ready and contains a deliberately planted configuration mismatch. Never deploy these examples to a real environment.

## Demo scenarios

### Scenario A — Encryption at rest (questionnaire row 42)
- `policies/security-policy.md` requires production database storage to be encrypted at rest using AES-256 or an approved equivalent.
- `infra/terraform/database.tf` sets `storage_encrypted = false`.
- Expected ClaimTrail result: **Issue Detected** or **Needs Review**, depending on the supported rule. Link both the policy statement and the actual Terraform setting. Do not claim that this proves the state of a deployed database.

### Scenario B — SAML replay protection (questionnaire row 18)
- `src/auth/saml/assertion-validator.ts` checks issuer, audience, destination and time conditions.
- `src/auth/saml/replay-store.ts` contains an in-memory replay store example, but the validation flow does not yet call it.
- Expected result: **Needs Review** for end-to-end replay protection. Avoid stating that SAML is fully secure.

### Other evidence areas
- Tenant authorization: `src/tenancy/tenant-authorizer.ts`
- Audit events: `src/observability/audit-events.ts`
- Data retention: `config/data-retention.yaml`
- AI tool allowlist: `src/ai/tool-policy.ts`
- Backups and recovery: `infra/terraform/database.tf`, `docs/operations/backup-and-recovery.md`
- Incident response: `policies/incident-response.md`
- Change management: `policies/change-management.md`
- Tests: `tests/`

## Repository layout

```text
config/                 Example application configuration
docs/                   Architecture and operations notes
infra/terraform/        Infrastructure configuration
policies/               Synthetic policy documents
src/                    Small TypeScript examples
tests/                  Unit tests for the examples
```

## Connect this repo to ClaimTrail

1. Push this folder to a **public GitHub repository**.
2. Copy the repository URL.
3. In ClaimTrail, open Evidence and add the GitHub repository.
4. Upload the matching security questionnaire workbook and policy PDF.
5. Review each answer's evidence snippets and source locations.

## Safe interpretation

A repository scan only inspects the files and revision that were retrieved. It does not prove how production is deployed, whether a cloud resource has drifted, or whether omitted files are secure. Missing evidence means **Needs Review**, not automatically **Issue Detected**.

## Local test examples

This is a dependency-free illustrative TypeScript repository. The source files use TypeScript types and ordinary functions; the repository is designed primarily for static evidence ingestion, not as a complete runnable service.
