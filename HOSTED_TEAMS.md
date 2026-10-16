# Hosted accounts and teams — first collaboration PR

Atelier can connect to a hosted Supabase project for email-code accounts, display names, team workspaces, invitations, member roles and shared board versions. The desktop application and browser preview use the same service. Existing local workspaces stay on their devices and work offline without signing in. Opening Teams never uploads a local workspace.

This is explicit version sharing, not simultaneous editing. A team member adds a local copy, edits it using the existing canvas, and publishes a new version when ready. Local copies are independent and use fresh IDs. A new publish creates a shared board; “Publish over this” replaces a selected shared version after confirmation. A server-side revision check rejects stale replacements, including concurrent publication. Refresh Teams and review the current version before retrying. Local autosave never writes to the service.

## Provision the hosted service once

1. Create a hosted Supabase project. Keep its database password and secret/service-role keys out of Atelier and GitHub.
2. In the project's SQL Editor, run `supabase/migrations/202610160001_hosted_teams.sql` once. For an existing deployment, use Supabase migrations rather than rerunning it.
3. Enable email sign-in in Authentication. Configure your SMTP provider for delivery to your actual users. The default test email service has delivery restrictions and is not a production mail service.
4. Configure both the **Magic Link** and **Confirm signup** email templates to display the one-time code using `{{ .Token }}`. For example: `<p>Your Atelier sign-in code is {{ .Token }}</p>`. Atelier accepts a code typed into the app; it does not consume redirect links. Keep email confirmation enabled and configure OTP expiry/rate limits in Supabase Authentication.
5. Copy the project URL (`https://PROJECT.supabase.co`) and **publishable** key from the project settings. The legacy `anon` key is also supported. These identify the project and are intended for client use; access is enforced by the signed-in user's identity and PostgreSQL policies. Never use a secret/service-role key. Custom domains are not supported in this PR.
6. Build Atelier (`npm ci`, `npm run build:ui`, or the existing macOS build). Choose **Accounts & teams**, enter the project URL and publishable key, and connect. Repeat with the same project on every participating device. Configuration is stored locally, not in exported workspaces.
7. Enter your email, request a code, then enter the code from your email. A first sign-in creates the account. Set your display name and create a team.

No hosted project is provisioned by this PR. It contains the deployment migration, client integration and tests; it needs the project and SMTP configuration above before real users can connect. No billing, external deployment or email is triggered by running the local tests.

## Invite and share

The team owner creates an invitation for a person's email and chooses Editor or Viewer. Invitations expire after seven days and can be revoked or reissued. Tell the person to connect to the same Atelier service, sign in with that email, and accept the invitation under Teams. **This PR does not send invitation emails**; only the authentication service sends sign-in codes. Invitation acceptance checks the current verified email in `auth.users`, not client-supplied email or profile data. Reissuing invalidates the old invitation ID; accepting twice is rejected.

| Team role | Read shared versions and add local copies | Publish new/replacement versions | Invite, revoke, change roles, remove members | Delete shared versions |
| --- | --- | --- | --- | --- |
| Owner | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | No | No |
| Viewer | Yes | No | No | No |

All members can read all boards shared into their team. Create separate teams to separate audiences; there are no per-board guest permissions in this PR. Viewers can edit their own local copies, but cannot publish to the team. Removing a member stops subsequent server reads/writes. Previously downloaded copies cannot be recalled. The owner cannot remove or demote themselves. Ownership transfer, deleting a team, and leaving a team are deferred; manage those deliberately through a later workflow rather than making a team ownerless.

“Share current board” shows the included board names before uploading. It includes nested boards and board-link dependencies, embedded media and existing annotations, using the existing Atelier package format. Managed original files and native video references are omitted, just as in a package export; no file-storage service is provided in this PR. The client rejects packages larger than 10 MiB; PostgreSQL independently caps its JSON representation at 10 MiB (formatting can make the server cap slightly stricter). Boards are validated again on download before they enter the local workspace. Back up the hosted database using your Supabase plan's facilities.

## Session and access behavior

Sessions use Supabase Auth and are held in session storage, not workspace backups. Closing the browser session or restarting the desktop app requires another sign-in; the public project connection remains. Sign out clears the local session. Disconnect signs out and removes the project connection. Team boards are fetched on demand and are not cached by this feature. Choosing Add local copy intentionally saves the downloaded content into the device's existing workspace and recovery model.

All four team tables and the profiles table have row-level security. Anonymous users have no table access or mutation RPC grants. Membership and invitation mutations are transaction-scoped database functions with an empty search path and explicit identity/role checks. Authenticated clients have only SELECT access to the team tables, plus explicit RPC execution. Profile writes are limited to the user's own row; teammates can see display names, not another account's email. Invitation emails are visible only to their intended verified recipient and the team owner. The browser connection uses HTTPS to hosted `*.supabase.co`; the Tauri CSP allows that origin family for network requests without allowing remote scripts.

## Validation

`npm test` includes executable PostgreSQL authorization tests using PGlite. They emulate the Supabase `auth.users` and `auth.uid()` contract and run the actual migration with PostgreSQL roles, grants, RLS and functions. Coverage includes anonymous/outsider denial, team isolation, verified invitation acceptance, revocation/replay, viewer/editor/owner restrictions, direct-write denial, profile visibility, member removal and stale publication rejection. These do not substitute for a real Supabase Auth/SMTP deployment test.

`npm run test:teams` runs the browser flow against a mocked Supabase API: connection, email codes, profile, team creation, invitation creation, publish confirmation, download into local workspace, viewer controls, sign-out and local-board preservation. Run `npm run build:ui` and start `node scripts/serve.mjs` first. Existing canvas, backing and interchange suites continue to apply.

Before inviting actual users, complete a two-account acceptance test against the provisioned project: receive real codes, create/join a team, publish/download a board, verify viewer refusal using the API, race two publications, remove a member and verify denial, and reopen the packaged desktop app. Simultaneous editing, presence/cursors, team comments/mentions, email invitations, per-board sharing, hosted media originals, OAuth and account deletion UI remain future work.

Provider references: [Supabase email codes](https://supabase.com/docs/guides/auth/auth-email-passwordless), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
