import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://ua.vitaloop.today'
const DEFAULT_TITLE = 'Vitaloop Ukraine — персональна оцінка симптомів і аналізів'
const DEFAULT_DESCRIPTION = 'Постійна втома, поганий сон чи низька енергія? Vitaloop допоможе знайти можливі причини, пріоритети аналізів і персональний план дій.'
const DEFAULT_IMAGE = `${BASE_URL}/images/ua-og-preview-20260604.png`

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  canonicalUrl,
  image = DEFAULT_IMAGE,
  imageAlt = 'Vitaloop Ukraine — персональна оцінка симптомів, аналізів і плану дій',
  noindex = false,
  structuredData = null,
}) {
  const canonical = canonicalUrl || `${BASE_URL}${path}`
  return (
    <Helmet>
      <html lang="uk" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1'} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="VITALOOP Ukraine" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="uk_UA" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  )
}
