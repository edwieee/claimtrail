# Application Architecture

This fictional service is organized into a small HTTP API, authentication helpers, tenant authorization, audit-event formatting, and infrastructure-as-code.

## Trust boundaries
- Browser requests are untrusted.
- Tenant IDs supplied by a browser must not be treated as authoritative.
- Authentication assertions must be validated before a user context is created.
- AI model output is untrusted and must not directly execute privileged actions.
- Infrastructure configuration describes desired state, not necessarily the current deployed state.

## Components
- `src/auth/saml/`: SAML assertion conditions and a demonstration replay store.
- `src/tenancy/`: tenant-context authorization helper.
- `src/observability/`: safe audit-event shape.
- `src/ai/`: tool allowlist.
- `infra/terraform/`: sample database resource configuration.
- `config/`: retention and application settings.

## Known demo gaps
- The sample SAML validator does not integrate replay protection into its validation path.
- The database storage encryption setting intentionally conflicts with the policy.
- This repo has no production cloud credentials, live database, deployment pipeline, or real customer data.
