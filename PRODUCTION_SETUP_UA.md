# VITALOOP.TODAY/UA - Ukrainian Version (Production Setup)

## Domain & Access
- **Primary Domain**: `ua.vitaloop.today` (or vitaloop.today/ua subfolder)
- **Server IP**: `159.65.252.227`
- **User**: `root`
- **Frontend**: `/var/www/VITALOOP_UA/frontend/dist/` (or symlink from ua.vitaloop.today location)
- **Backend**: Shared with EN version on port `8006` (or separate UA instance)

## Frontend Deployment Rules (CRITICAL)

### Core Principle
**Production build ALWAYS happens locally on Mac, NEVER on the server.**

1. **Local Build** (on Mac):
   ```bash
   cd vitaloop_ua
   npm ci
   npm run build
   ```

2. **Deploy to Server** (via rsync - SEPARATE from EN):
   ```bash
   chmod +x ../vitaloop_ua/scripts/deploy-frontend-dist.sh
   ../vitaloop_ua/scripts/deploy-frontend-dist.sh
   ```

3. **Post-Deploy**:
   - SSH to server: `ssh root@159.65.252.227`
   - Reload nginx: `nginx -t && systemctl reload nginx`
   - Verify: https://ua.vitaloop.today (hard refresh with Cmd+Shift+R)

### Important Notes
- **COMPLETELY SEPARATE** from EN build — do NOT mix dist/ folders
- **DO NOT run `npm run build` on server** — it's disabled
- **DO NOT use `git pull` for frontend on server**
- **Deploy path MUST be different** from EN (`/var/www/VITALOOP_UA/` or dedicated location)
- All fixes must go through: code → local build → rsync deploy

## Nginx Configuration
- **Config Path**: `/etc/nginx/sites-available/ua.vitaloop.today`
- **Root Path**: `/var/www/VITALOOP_UA/frontend/dist` (or separate location)
- **Index**: `index.html` (SPA fallback)
- **SSL**: Managed by Certbot (Let's Encrypt)

### Key Routes
- `/` → Ukrainian landing page
- `/dashboard` → may redirect to CRM or UA-specific dashboard
- `/api/v1/*` → proxies to backend (port 8006 or UA-specific backend)

### SPA Fallback
All unknown paths serve `index.html` for client-side routing:
```
location / {
    try_files $uri $uri/ /index.html;
}
```

## Frontend Structure (dist)
```
dist/
├── index.html              (main SPA entry, no-cache)
├── build-info.json        (build metadata, no-cache)
├── manifest.json          (PWA manifest, no-cache)
├── sw.js                  (service worker, no-cache)
├── registerSW.js          (SW registration, no-cache)
├── 404.html               (not found page)
├── robots.txt             (SEO - Ukrainian)
├── sitemap.xml            (SEO - Ukrainian)
├── assets/                (hashed files, 1-year cache)
│   ├── js/                (*.js, immutable)
│   ├── css/               (*.css, immutable)
│   └── images/            (*.png, *.svg, etc., immutable)
├── analizy/               (Ukrainian routes)
├── laboratorii/
├── samopochuttia/
├── tarify/
├── login/
├── onboarding/
├── settings/
└── ... (other SPA routes in Ukrainian)
```

## Cache Strategy
- **HTML/Manifest/SW**: `no-cache, must-revalidate` — always revalidate
- **Hashed assets** (*.js, *.css, *.png, etc.): 1-year cache (`immutable`)
- Browser learns about updates via service worker

## Backend Integration
- **API Endpoint**: `https://ua.vitaloop.today/api/v1/`
- **Backend Service**: `http://127.0.0.1:8006` (shared with EN, OR separate instance)
- **Timeout**: 180s read/write (for long-running analysis)
- **Headers**: `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`

### Backend Considerations
- If using **shared backend**: API responses must support language parameter
- If using **separate UA backend**: May need different credentials/API keys
- Coordinate with backend team for language-specific logic

## Security Headers (Applied by nginx)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Common Deployment Scenarios

### Fix a Bug (Ukrainian Version)
1. Fix code in `vitaloop_ua/src/`
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `scripts/deploy-frontend-dist.sh` (from vitaloop_ua directory)
5. Verify: https://ua.vitaloop.today (Cmd+Shift+R)

### Update Content/Copy (Ukrainian)
1. Edit Ukrainian text in `vitaloop_ua/src/`
2. Same steps as above
3. **DO NOT accidentally deploy to EN version** — separate dist paths!

### Emergency Rollback
```bash
# If old build is still available locally
cd vitaloop_ua
npm run build
scripts/deploy-frontend-dist.sh
```

## Monitoring & Diagnostics

### Check UA Deployment Status
```bash
ssh root@159.65.252.227 "ls -la /var/www/VITALOOP_UA/frontend/dist/ | head -20"
```

### Verify nginx for UA
```bash
ssh root@159.65.252.227 "nginx -t"
```

### Check Recent Files (UA)
```bash
ssh root@159.65.252.227 "ls -lt /var/www/VITALOOP_UA/frontend/dist/ | head -10"
```

### View nginx Logs (UA)
```bash
ssh root@159.65.252.227 "tail -f /var/log/nginx/access.log | grep ua.vitaloop.today"
```

## Important: Separation from EN Version

### Never Mix Deployments
- **EN build** → `/var/www/VITALOOP/frontend/dist/`
- **UA build** → `/var/www/VITALOOP_UA/frontend/dist/`
- Each has its own nginx config, SSL cert, and deployment script

### Prevent Accidental Overwrites
Before deploying:
1. Verify you're in `vitaloop_ua/` directory, NOT `vitaloop/`
2. Check that `dist/` contains Ukrainian content (look for `analizy`, `laboratorii`)
3. Confirm deployment script targets correct path on server

### Quick Verification
```bash
# Check EN site has English paths
ssh root@159.65.252.227 "ls /var/www/VITALOOP/frontend/dist/ | grep -E 'features|about|investors'"

# Check UA site has Ukrainian paths
ssh root@159.65.252.227 "ls /var/www/VITALOOP_UA/frontend/dist/ | grep -E 'analizy|laboratorii|tarify'"
```

## Related Documentation
- [../vitaloop/PRODUCTION_SETUP_EN.md](../vitaloop/PRODUCTION_SETUP_EN.md) — English version setup
- [nginx.ua.vitaloop.conf](./nginx.ua.vitaloop.conf) — Full nginx configuration for UA
- [scripts/deploy-frontend-dist.sh](./scripts/deploy-frontend-dist.sh) — Deployment script

## Internationalization (i18n) Notes
- **Language Code**: `uk` (Ukrainian)
- **Locale**: `uk_UA`
- **RTL**: Not applicable (Ukrainian uses LTR)
- **Date Format**: `DD.MM.YYYY` (European)
- **Currency**: `₴` (Ukrainian Hryvnia) / `UAH`
- **Number Format**: Space as thousands separator, comma as decimal

## Last Updated
2026-06-30
