# ClaimTrail Deployment

## Required environment variables

Set these on the server platform, never in client-exposed variables:

```text
OPENAI_API_KEY=replace_with_server_secret
OPENAI_MODEL=gpt-4o-mini
GITHUB_TOKEN=optional_server_token
```

`.env.local` is for local development and is excluded from Git. Do not paste secrets into source files, browser code, logs, or screenshots.

## Build and run

```bash
npm ci
npm test
npm run build
npm start
```

The health probe is available at `/api/health`.

## Persistence requirement

ClaimTrail currently stores assessments, uploads, exports, and repository inspection caches under `.data/` on the local filesystem. This is suitable for a single long-lived Node server or container with a persistent volume. It is **not durable on serverless deployments** where the filesystem may be temporary and instances do not share local state.

Before deploying to a serverless platform, replace the file-backed store and local upload/export directories with durable object storage and a database, or attach a persistent volume through the selected hosting platform. Do not treat a successful health response as proof that assessment persistence is durable.

## Deployment checklist

- Configure the environment variables above in the hosting provider.
- Confirm `npm test` and `npm run build` pass in CI.
- Verify `/api/health` after startup.
- Use a persistent volume or migrate `.data/` before accepting real assessments.
- Confirm GitHub API rate limits and OpenAI billing/quota separately.
- Keep `.env.local`, `.data/`, and generated `.next/` output out of commits.