# AWS Deployment (Frontend)

## Architecture

```
GitHub Actions (push to main)
  → npm run build (Vite → dist/)
  → aws s3 sync dist/ → S3 bucket (private)
  → aws cloudfront create-invalidation
  → CloudFront (HTTPS, S3 origin via Origin Access Control)
```

No custom domain is required: CloudFront's own `*.cloudfront.net` domain already carries a valid AWS-managed HTTPS certificate. The S3 bucket is fully private (`BlockPublicAcls`/`BlockPublicPolicy` all on) — only CloudFront, via an Origin Access Control, is allowed to read from it. There is no server here at all; static files behind a CDN.

GitHub Actions authenticates to AWS via **OIDC** (`aws-actions/configure-aws-credentials`) — no long-lived AWS access keys stored as GitHub secrets.

## One-time setup

1. **IAM**: create the GitHub OIDC provider (shared with `be-boiler` if both repos are in the same AWS account) and an IAM role assumable by this repo's `main` branch (S3 + CloudFront access).
2. **S3 bucket**: private, versioning optional, all public-access-block settings on.
3. **CloudFront distribution**: S3 bucket as origin with an **Origin Access Control** attached (not a public bucket + `OriginProtocolPolicy`), **default root object** `index.html`, and — this is the part that's easy to miss — a **custom error response** mapping 403 and 404 → `/index.html` with a 200 status. Without that, refreshing the browser on any client-side route (e.g. `/staff/123`) 404s, because S3 has no such object; React Router never gets a chance to handle it.
4. Apply the bucket policy CloudFront generates for you (restricts `s3:GetObject` to that one distribution's OAC).
5. **GitHub repo variables** (Settings → Actions → Variables): `AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.
6. Once the backend's CloudFront domain exists (see `be-boiler`'s `docs/deployment-aws.md`), set it in `.env.production`'s `VITE_API_BASE_URL` and commit — Vite bakes this in at build time, so it must be correct before the CI build step runs, not set as a runtime GitHub Actions variable.

## What CI does on every push to `main`

`.github/workflows/main.yml`'s `deploy-s3-cloudfront` job (after `build-and-test` + `e2e-test` pass):
1. `npm run build` — produces `dist/` using whatever `VITE_API_BASE_URL` is committed in `.env.production`.
2. Assumes the deploy IAM role via OIDC.
3. `aws s3 sync ./dist s3://$S3_BUCKET --delete` — mirrors the build output, removing anything stale.
4. `aws cloudfront create-invalidation --paths "/*"` — without this, CloudFront keeps serving the previous cached build for up to its TTL.

This job is independent of the `docker-build-push` job already in the same workflow — that one builds an Nginx-container image to GHCR, for anyone hosting this app by running the `Dockerfile`+`nginx.conf` as a container instead (e.g. on the same EC2 instance as the backend, or ECS). Both paths can coexist; only one needs to actually be wired to real infrastructure.

## Known limitations

- **IAM policies are broad (`*FullAccess`) to get started quickly** — tighten to the specific bucket ARN and distribution ARN once the pipeline is verified working.
- **`VITE_API_BASE_URL` is baked in at build time**, not read at runtime — changing the backend's URL means editing `.env.production` and letting CI rebuild, not just flipping an environment variable in AWS.

## Related docs

- [Architecture](./architecture.md) — how this fits the rest of the frontend
- `be-boiler`'s [deployment-aws.md](../../be-boiler/docs/deployment-aws.md) — the backend half of this same deployment
