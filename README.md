# Skin Analysis

A skincare app that photographs skin, asks Gemini 2.5 Flash for a cosmetic report, and attaches shopping results. It was generated inside Anything (create.xyz) and now runs on its own.

- `apps/mobile` — Expo SDK 54 app (Expo Router). The camera tab posts a photo to `POST /api/analyze-skin`.
- `apps/web` — React Router UI plus the Hono API (auth, scans, Stripe, uploads). This is the server the phone calls.

Anything's `/integrations/*` proxies, create.xyz host headers, and Uploadcare-via-Anything uploads are gone. Gemini, product search, auth, Stripe, and uploads talk to services you configure with environment variables.

## What you need to supply

| Variable | Where | Required | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | web | Yes, for analysis | [Google AI Studio](https://aistudio.google.com/apikey) key. Model defaults to `gemini-2.5-flash`. |
| `DATABASE_URL` | web | Yes, for accounts and saved scans | Neon or any Postgres URL. Analysis still returns without it; saving does not. |
| `AUTH_SECRET` | web | Yes, for sign-in | `openssl rand -base64 32` |
| `AUTH_URL` | web | Yes, for sign-in | Public origin of this server, including scheme. Example: `http://localhost:4000` |
| `EXPO_PUBLIC_API_URL` | mobile | Yes | Same origin, no trailing slash. Inlined into the app at bundle time. |
| `STRIPE_SECRET_KEY` | web | For card checkout | Stripe secret key. Checkout is `POST /api/stripe-checkout-link` ($2.99/month, created inline). |
| `SERPAPI_KEY` | web | No | [SerpAPI](https://serpapi.com/) Google Shopping. If it is missing, the report still returns and `products` is empty. Set `PRODUCT_SEARCH_PROVIDER=none` to skip lookup on purpose. |
| `UPLOADCARE_PUBLIC_KEY` | web | No | When set, `POST /api/upload` stores files on Uploadcare. Also set `UPLOADCARE_SECRET_KEY` if the Uploadcare project requires signed uploads. Without a key, base64 uploads come back as data URLs. |
| `REVENUECAT_WEBHOOK_AUTHORIZATION` | web | For store subscriptions | Exact `Authorization` header value from the RevenueCat webhook settings. |
| `EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY` | mobile | For App Store purchases | RevenueCat public iOS SDK key. |
| `EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY` | mobile | For Play purchases | RevenueCat public Android SDK key. |
| `EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY` | mobile | For dev builds | Used when the app is in development. |
| `CORS_ORIGINS` | web | No | Comma-separated browser origins. Empty means any origin. Native Expo does not use CORS. |
| `GEMINI_MODEL` | web | No | Defaults to `gemini-2.5-flash`. |
| `GEMINI_API_BASE_URL` | web | No | Leave unset. Only for a proxy in front of the Gemini API. |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | mobile | No | Only referenced by an unused maps polyfill. |

Copy the examples and fill them in:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Do not commit `.env` files.

## Run the database migration

From `apps/web`, with `DATABASE_URL` set:

```bash
cd apps/web
npm install
npm run db:migrate
```

`db/schema.sql` creates every table the API uses:

- `auth_users`, `auth_accounts`, `auth_sessions`, `auth_verification_token` (Auth.js credentials)
- `user_profiles`, `user_preferences`
- `skin_scans`
- `user_scan_usage` (5 free scans per calendar month; `subscription_status = active` is unlimited)

The script is idempotent. `auth_users` also has `stripe_id`, `subscription_status`, and `last_check_subscription_status_at`.

## Run locally

Use Node 20 or newer. Two terminals.

Web (API + account pages). Dev server listens on `0.0.0.0:4000`:

```bash
cd apps/web
npm install
npm run dev
```

Mobile, with `EXPO_PUBLIC_API_URL` pointing at that server:

```bash
cd apps/mobile
npm install
npx expo start
```

Open the project in Expo Go. On a physical phone, `localhost` is the phone itself. Set `EXPO_PUBLIC_API_URL` to your computer's LAN address, for example `http://192.168.1.20:4000`, then restart Expo so the value is inlined. The Android emulator should use `http://10.0.2.2:4000`.

Sign up and sign in from the app call `POST /api/auth/token`. The app stores the JWT and sends `Authorization: Bearer` on later requests. Web account pages (`/account/signin`, `/account/signup`) use the same database.

`POST /api/analyze-skin` accepts JSON `{ "imageUri": "data:image/jpeg;base64,...", "bodyPart": "face" | "hand" | "arm" }`. The prompt and the report JSON shape are unchanged. Request bodies are limited to 4.5 MB. The camera screen resizes photos before upload so they stay under that.

## Deploy the backend

The API is a long-running Node server (Hono inside React Router), not a serverless function file. Deploy `apps/web` to any Node host (Render, Railway, Fly, a VM). Vercel serverless will not serve these Hono routes unless you wrap the built Node server yourself; prefer a Node service.

```bash
cd apps/web
npm install
npm run build
PORT=4000 npm start
```

`npm start` runs `node ./build/server/index.js`. The Hono server listens on `0.0.0.0` and `PORT` (default 3000). Set `PORT` to the host's port. `npm install` uses `legacy-peer-deps` (see `apps/web/.npmrc`) because the generated React Router stack pins React 18 types.

Set the same environment variables as local, with `AUTH_URL` set to the public `https://` origin. Point the mobile app's `EXPO_PUBLIC_API_URL` at that origin and rebuild the app. `EXPO_PUBLIC_*` values are baked in at bundle time, so changing the API URL requires a new Expo or EAS build.

Apply the schema against production once:

```bash
cd apps/web
npm run db:migrate
```

On Render, use a Web Service with root directory `apps/web`, build command `npm install && npm run build && npm run db:migrate`, and start command `npm start`. Bind `0.0.0.0:$PORT`. The filesystem is ephemeral, so do not store uploads on disk. Use Uploadcare or data URLs in Postgres.

### Subscriptions

Two billing paths exist:

- **Stripe.** `POST /api/stripe-checkout-link` with `{ "redirectURL": "https://your-api.example/subscription" }` creates a Checkout session for the signed-in user. `POST /api/get-subscription-status` reads `auth_users.subscription_status` and, when `STRIPE_SECRET_KEY` is set, refreshes it from Stripe if it is missing or older than 30 days. The JSON includes `hasAccess: true` when the status is `active` or `trialing`.
- **App Store / Play (RevenueCat).** The mobile app initializes `react-native-purchases` only when the public SDK key for that platform is set. After a purchase it calls `Purchases.logIn` with the database user id. Point a RevenueCat webhook at `https://YOUR_DOMAIN/api/revenuecat-webhook` and set `REVENUECAT_WEBHOOK_AUTHORIZATION` to the dashboard's authorization header. Purchase and renewal events set `subscription_status` to `active`; expiration sets `expired`. Cancellation is ignored until expiration, so the user keeps access through the paid period.

There is no RevenueCat webhook until you create it. Without it, a store purchase does not raise the scan limit. The dev-only `POST /api/dev/toggle-premium` route flips status when `NODE_ENV=development`.

Free accounts can save 5 scans per `YYYY-MM`. That counter is `user_scan_usage`.

## Build for the stores (EAS)

TODO for the client: `app.json` uses the placeholder display name **Skin Analysis** and the placeholder ids `com.example.skinanalysis` (`ios.bundleIdentifier` and `android.package`). Replace both with the client's legal name and reverse-DNS ids before `eas build`, and create the matching App Store Connect and Play Console apps. Apple will reject `com.example.*`.

```bash
cd apps/mobile
npm install -g eas-cli
eas login
eas init
```

`eas init` writes `extra.eas.projectId` into `app.json`. Put `EXPO_PUBLIC_API_URL` (and the RevenueCat public keys) in the EAS environment for the production profile. `eas.json` already has `development`, `preview`, and `production` profiles.

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

Store review still needs a camera usage string (already set), a privacy policy, screenshots, and a real bundle id. In-app purchases need products in App Store Connect and Play Console, then a RevenueCat offering whose packages the app can load. The subscribe button uses RevenueCat offerings, not the Stripe Checkout route.

## What changed relative to Anything

- Gemini is called with `@google/genai` (`gemini-2.5-flash`) using the existing prompt. The report JSON is parsed the same way.
- Product search calls SerpAPI Google Shopping and maps results into the fields the report screen already reads (`title`, `image`, `price`, `store`, `rating`, `url`). No key means no products, not a failed analysis.
- The Expo app prefixes relative `/api/...` calls with `EXPO_PUBLIC_API_URL`.
- Auth cookies are `SameSite=Lax` and are marked Secure only when `AUTH_URL` is `https://`. They no longer depend on Anything's iframe.
- `POST /api/upload` replaces `/_create/api/upload`.
- The server no longer proxies `/integrations/*` to create.xyz.
- The Anything dev menu only mounts when `EXPO_PUBLIC_IS_ANYTHING_APP` is the string `true`. Leave that unset.

The `__create` folders are still the local server entry, auth adapter, and Expo error boundary. They do not call create.xyz.
