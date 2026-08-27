# LA Elite Peptides repository inspection

**Source:** `https://github.com/EKhelil11/website-peptide`  
**Branch:** `main`  
**Inspected commit:** `f64a146596cbad89228e743dd52ee0aefd2bad08`

## Confirmed architecture

| Area | Repository implementation |
|---|---|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS 4, Wouter, React Query |
| API | Express 4 with tRPC 11 at `/api/trpc` |
| Database | Drizzle ORM with MySQL and five included SQL migrations |
| Authentication | Manus OAuth for administrators plus separate email/password customer sessions |
| Commerce | Static product catalog, client cart, persisted orders and order items |
| Email | Resend; designed to skip sends when `RESEND_API_KEY` is absent |
| Fulfillment | ShipStation API, custom-store feed, and webhook endpoints |
| Storage | Manus Forge/storage proxy integration |
| Testing | Vitest tests for logout, customer authentication, Resend configuration, and ShipStation configuration |

## Environment-variable inventory

The repository references `DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `VITE_APP_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_OAUTH_PORTAL_URL`, `RESEND_API_KEY`, `SHIPSTATION_API_KEY`, `SHIPSTATION_API_SECRET`, `NODE_ENV`, and `PORT`. No values were printed or copied from any prior project.

## Data-restoration boundary

The GitHub repository contains source code and migrations only. It does not contain the prior project database, customer accounts, password hashes, orders, customer sessions, uploaded files, or previous secret values. The replacement must use a new empty database and fresh runtime configuration. This is a rebuild from source, not a restoration of historical Task Data.

## Import considerations

The repository's `template.json` still identifies the original scaffold as static, but the current source has evolved into a full-stack Express, tRPC, Drizzle, and MySQL application. The replacement project must therefore use a new full-stack scaffold. The production entrypoint is `server/_core/index.ts`; the older `server/index.ts` is only a static server and is not the package build target.

The storefront design is documented as **Midnight Clinic** and should be preserved. Product images already use `/manus-storage/...` references, so the repository does not contain local image or video files that require migration.

## Initial risks to validate

| Risk | Validation needed |
|---|---|
| Optional email credentials absent | Registration and order flows must not crash; no live email should be sent in testing |
| Optional ShipStation credentials absent | Payment and tracking actions must not create live fulfillment traffic |
| New empty database | All five migrations must apply in order and create the required tables |
| Admin authorization | The new owner identity must be recognized through fresh Manus OAuth values |
| Existing product/customer UI | Routes and visual behavior must remain unchanged except for deployment blockers |
| Email tax wording | Repository email templates may still display 9% while order calculations use 8%; confirm during build/runtime review before changing |
