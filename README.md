# VITALOOP Ukraine

Standalone Ukrainian frontend for `ua.vitaloop.today`.

This repository contains only the Ukrainian product surface:

- Ukrainian marketing site
- Ukrainian auth/register UI
- Ukrainian user cabinet shell
- Ukrainian upload flow
- Ukrainian lab results list and result summary
- Ukrainian symptom quiz
- Ukrainian pricing/settings screens

The app reuses the existing VITALOOP backend API and Supabase Auth, but it is intentionally separated from the main `softdabtech/vitaloop` repository to avoid route, SEO, deploy, and UI conflicts.

## Production

- Site: `https://ua.vitaloop.today`
- API: `https://api.vitaloop.today`
- Auth: existing Supabase project

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required environment variables:

```bash
VITE_API_BASE_URL=https://api.vitaloop.today
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_CRM_BASE_URL=https://crm.vitaloop.today
VITE_APP_BASE_URL=https://ua.vitaloop.today
VITE_AUTH_POST_LOGIN_PATH=https://ua.vitaloop.today/dashboard
```

## Build

```bash
npm run build
```

The production build is written to `dist/`.

## Notes

- Do not add English marketing/cabinet pages here.
- Do not add main-site routes here.
- Keep UA copy, SEO, and UI independent.
- Backend schema and auth logic stay in the main backend until a dedicated UA backend is intentionally introduced.
