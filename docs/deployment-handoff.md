# Deployment Handoff

This note keeps the project safe while the public Vercel deployment is removed.

## Current Status

- Public demo is intentionally disabled until a new hosting decision is made.
- Frontend configuration is read from `frontend/.env.local` locally and from platform secrets in deployment.
- Backend generator configuration is read from `backend/generator/config.env` locally and from platform secrets in deployment.
- The repo does not need a committed Vercel project link to run locally.

## Vercel Removal Checklist

1. Disable or delete the Vercel project from the Vercel dashboard.
2. Remove the GitHub integration or deploy hook for this repository if it still exists.
3. Remove custom domains from Vercel before deleting the project, if any were connected.
4. Revoke or rotate any Supabase, Gemini, Google Cloud, or backend keys that were stored in Vercel.
5. Confirm that the old Vercel URL is no longer shown as an active demo in GitHub repo metadata.
6. Keep local env files uncommitted and use only `.env.example` files as templates.

## Local Verification

Run these checks after config changes:

```bash
cd frontend
npm run typecheck
```

```bash
python3 -m compileall -q backend/generator
```

```bash
curl http://localhost:8000/health
curl http://localhost:8000/ready
```

## Future Hosting Options

- Static hosting alone is not enough because the frontend uses Next.js API routes.
- A future deployment should use a Next.js-compatible platform and define secrets at platform level.
- The backend can remain separate on a Python-friendly host, as long as `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL` point to it.
- Public demo links should be added back only after a health check and secret review.
