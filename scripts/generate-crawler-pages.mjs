import fs from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.resolve(process.cwd(), 'dist')
const BASE_URL = 'https://ua.vitaloop.today'
const DEFAULT_IMAGE = `${BASE_URL}/images/ua-og-preview-20260604.png`

const routes = [
  {
    path: '/',
    title: 'Vitaloop Ukraine — персональна оцінка симптомів і аналізів',
    description: 'Постійна втома, поганий сон чи низька енергія? Vitaloop допоможе знайти можливі причини, пріоритети аналізів і персональний план дій.',
    priority: '1.0',
    changefreq: 'weekly',
    text: [
      'Vitaloop Ukraine допомагає почати з самопочуття, симптомів і контексту здоровʼя.',
      'Сервіс структурує скарги, підказує пріоритети аналізів, пояснює результати простими словами та формує план наступних дій.',
      'Це освітній HealthTech-продукт, а не заміна лікаря.',
    ],
  },
  {
    path: '/samopochuttia',
    title: 'Оцінка самопочуття | Vitaloop Ukraine',
    description: 'Опишіть втому, сон, енергію, концентрацію чи інші зміни самопочуття, щоб отримати зрозумілий напрям для наступного кроку.',
    priority: '0.9',
    changefreq: 'monthly',
    text: [
      'Оцінка самопочуття допомагає зафіксувати, що саме турбує зараз і як це впливає на день.',
      'Vitaloop структурує симптоми та допомагає підготуватися до подальшої перевірки.',
    ],
  },
  {
    path: '/symptomy',
    title: 'Симптоми та можливі пріоритети | Vitaloop Ukraine',
    description: 'Vitaloop допомагає повʼязати симптоми з можливими напрямами перевірки без медичного туману та без постановки діагнозу.',
    priority: '0.9',
    changefreq: 'monthly',
    text: [
      'Симптоми можуть мати різні причини.',
      'Vitaloop допомагає описати скарги, побачити можливі пріоритети та підготувати питання до лікаря.',
    ],
  },
  {
    path: '/analizy',
    title: 'Аналізи та показники українською | Vitaloop Ukraine',
    description: 'Завантажуйте результати лабораторії, щоб побачити пріоритетні показники, контекст і план наступних дій українською мовою.',
    priority: '0.9',
    changefreq: 'monthly',
    text: [
      'Vitaloop працює з результатами аналізів і пояснює показники зрозумілою мовою.',
      'Сервіс виділяє пріоритети, повʼязує їх із симптомами та готує план для обговорення з фахівцем.',
    ],
  },
  {
    path: '/laboratorii',
    title: 'Лабораторії України | Vitaloop Ukraine',
    description: 'Vitaloop підтримує результати з популярних лабораторій України та допомагає зрозуміти, які показники потребують уваги.',
    priority: '0.8',
    changefreq: 'monthly',
    text: [
      'Vitaloop підтримує результати з популярних лабораторій України.',
      'Якщо лабораторії немає у списку, результати все одно можна завантажити, якщо у файлі видно показники, значення, одиниці та референси.',
    ],
  },
  {
    path: '/tarify',
    title: 'Тарифи | Vitaloop Ukraine',
    description: 'Безкоштовний старт і Premium для регулярної роботи з аналізами, симптомами, планом дій і прогресом.',
    priority: '0.7',
    changefreq: 'monthly',
    text: [
      'Vitaloop Ukraine має безкоштовний старт і Premium для регулярної роботи.',
      'Premium відкриває більше можливостей для аналізів, пріоритетів, плану дій і динаміки.',
    ],
  },
]

const privateRoutes = [
  '/login',
  '/dashboard',
  '/questionnaire',
  '/upload',
  '/lab-results',
  '/subscription',
  '/settings',
  '/onboarding',
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function upsertTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`)
}

function renderStaticRoot(route) {
  const paragraphs = route.text.map((item) => `<p>${escapeHtml(item)}</p>`).join('\n          ')
  return `<div id="root"><main data-crawler-content="true" style="max-width: 760px; margin: 0 auto; padding: 48px 20px; font-family: Inter, Arial, sans-serif; color: #0f172a;">
        <h1>${escapeHtml(route.title.replace(' | Vitaloop Ukraine', ''))}</h1>
        <p>${escapeHtml(route.description)}</p>
        ${paragraphs}
      </main></div>`
}

function renderHtml(baseHtml, route, { noindex = false } = {}) {
  const canonical = `${BASE_URL}${route.path === '/' ? '/' : route.path}`
  let html = baseHtml
  html = html.replace(/<html\b[^>]*>/i, '<html lang="uk">')
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
  html = upsertTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`)
  html = upsertTag(html, /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1'}" />`)
  html = upsertTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`)
  html = upsertTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
  html = upsertTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
  html = upsertTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`)
  html = upsertTag(html, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${DEFAULT_IMAGE}" />`)
  html = upsertTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
  html = upsertTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)
  html = html.replace(/<div id="root"><\/div>/i, renderStaticRoot(route))
  return html
}

function writeRouteFile(route, html) {
  if (route.path === '/') {
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html)
    return
  }
  const routeDir = path.join(DIST_DIR, route.path.replace(/^\//, ''))
  fs.mkdirSync(routeDir, { recursive: true })
  fs.writeFileSync(path.join(routeDir, 'index.html'), html)
}

function writeTextFile(name, contents) {
  fs.writeFileSync(path.join(DIST_DIR, name), contents.trimStart())
}

function main() {
  const indexPath = path.join(DIST_DIR, 'index.html')
  if (!fs.existsSync(indexPath)) throw new Error('dist/index.html not found. Run vite build first.')
  const baseHtml = fs.readFileSync(indexPath, 'utf8')

  for (const route of routes) writeRouteFile(route, renderHtml(baseHtml, route))

  for (const privatePath of privateRoutes) {
    writeRouteFile({
      path: privatePath,
      title: 'Приватна сторінка | Vitaloop Ukraine',
      description: 'Ця сторінка Vitaloop Ukraine потребує входу в акаунт.',
      text: ['Ця сторінка потребує авторизації.'],
    }, renderHtml(baseHtml, {
      path: privatePath,
      title: 'Приватна сторінка | Vitaloop Ukraine',
      description: 'Ця сторінка Vitaloop Ukraine потребує входу в акаунт.',
      text: ['Ця сторінка потребує авторизації.'],
    }, { noindex: true }))
  }

  const notFound = renderHtml(baseHtml, {
    path: '/404.html',
    title: 'Сторінку не знайдено | Vitaloop Ukraine',
    description: 'Запитану сторінку Vitaloop Ukraine не знайдено.',
    text: ['Запитану сторінку не знайдено. Поверніться на головну сторінку Vitaloop Ukraine.'],
  }, { noindex: true })
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFound)

  writeTextFile('robots.txt', `User-agent: *
Allow: /

Disallow: /dashboard
Disallow: /dashboard/
Disallow: /questionnaire
Disallow: /upload
Disallow: /lab-results
Disallow: /results/
Disallow: /protocol/
Disallow: /subscription
Disallow: /settings
Disallow: /onboarding
Disallow: /login
Disallow: /auth/confirmation

Sitemap: ${BASE_URL}/sitemap.xml
`)

  const today = new Date().toISOString().slice(0, 10)
  const urls = routes.map((route) => `  <url>
    <loc>${BASE_URL}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.path === '/' ? `
    <image:image>
      <image:loc>${DEFAULT_IMAGE}</image:loc>
      <image:title>Vitaloop Ukraine — симптоми, аналізи та план дій</image:title>
    </image:image>` : ''}
  </url>`).join('\n')

  writeTextFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`)

  writeTextFile('llms.txt', `# Vitaloop Ukraine

> Vitaloop Ukraine — українська версія HealthTech-продукту VITALOOP для роботи із самопочуттям, симптомами, аналізами, пріоритетами та планом дій.

## Офіційні сторінки
- Головна: ${BASE_URL}/
- Самопочуття: ${BASE_URL}/samopochuttia
- Симптоми: ${BASE_URL}/symptomy
- Аналізи: ${BASE_URL}/analizy
- Лабораторії: ${BASE_URL}/laboratorii
- Тарифи: ${BASE_URL}/tarify

## Що робить Vitaloop Ukraine
- Починає з опису самопочуття та симптомів.
- Допомагає побачити можливі пріоритети для перевірки.
- Пояснює результати аналізів українською мовою.
- Формує план наступних дій і питання до лікаря.

## Безпека
Vitaloop Ukraine не ставить діагнози та не замінює лікаря. Інформація має освітній характер і повинна обговорюватися з кваліфікованими медичними фахівцями.
`)

  console.log(`Generated UA crawler pages for ${routes.length} public routes and ${privateRoutes.length} private noindex routes.`)
}

main()
