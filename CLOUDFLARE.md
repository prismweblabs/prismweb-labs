# Deploy PrismWeb Labs on Cloudflare Pages (free)

## 1. Push this code to GitHub
Replace the files in your repo with this folder's contents (the old `netlify/` folder, `netlify.toml`
and `public/__forms.html` are removed; `functions/`, `wrangler.toml`, `public/_headers` are new).
Delete the old `package-lock.json` in the repo if it is still there, then commit and push.

## 2. Create the Pages project
Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git -> pick the repo.
- Framework preset: Next.js (Static HTML Export)
- Build command: `npm run build`
- Build output directory: `out`
- Environment variable: `NODE_VERSION` = `20`

## 3. Create the free storage (KV)
Workers & Pages -> KV -> Create namespace -> name it `prismweb-kv`.
Then your Pages project -> Settings -> Bindings -> Add -> KV namespace:
- Variable name: `PRISM_KV`
- Namespace: `prismweb-kv`
(Add it for Production, and Preview if you want.)

## 4. Admin password
Pages project -> Settings -> Variables and Secrets -> add `ADMIN_PASSWORD` (type: Secret).
Optional: add `WEB3FORMS_KEY` (free key from web3forms.com) to also get form messages by email.

## 5. Redeploy
Deployments -> Retry deployment (settings only apply to new deployments).

## 6. Custom domain (optional)
Pages project -> Custom domains -> add your domain; Cloudflare sets the DNS for you.

## Notes
- Contact and buy-request forms now POST to `/api/contact`. Messages are saved in KV and can be read
  at `GET /api/admin/messages` (send header `x-admin-password`), or by email if WEB3FORMS_KEY is set.
- KV changes can take up to ~60 seconds to appear everywhere.
- KV free plan: 1 GB storage, 1,000 writes/day, 25 MB max per file.
