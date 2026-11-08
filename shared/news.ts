export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail: string;
  description: string;
}

const FEED_URL = 'https://pitchfork.com/feed/rss';
const DEFAULT_AUTHOR = 'Pitchfork';
const MAX_DESCRIPTION_LENGTH = 150;

/** Decodifica as entidades HTML/XML usadas pelo feed RSS. */
function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

/** Extrai o conteúdo textual de uma tag simples, ex.: `<title>...</title>`. */
function pickTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? decodeEntities(match[1]).trim() : '';
}

/** Extrai o valor de um atributo de uma tag, ex.: `<media:content url="...">`. */
function pickAttribute(block: string, tag: string, attribute: string): string {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*\\b${attribute}=["']([^"']+)["']`, 'i'));
  return match ? decodeEntities(match[1]).trim() : '';
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractThumbnail(block: string, descriptionHtml: string): string {
  const fromMedia =
    pickAttribute(block, 'media:content', 'url') || pickAttribute(block, 'media:thumbnail', 'url');
  if (fromMedia) return fromMedia;

  const fromEnclosure = pickAttribute(block, 'enclosure', 'url');
  if (fromEnclosure) return fromEnclosure;

  const fromDescription = descriptionHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  return fromDescription ? fromDescription[1] : '';
}

function parseRssItems(xml: string): NewsArticle[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return items
    .map((item) => {
      const descriptionHtml = pickTag(item, 'description');
      const text = stripHtml(descriptionHtml);

      return {
        title: pickTag(item, 'title'),
        link: pickTag(item, 'link'),
        pubDate: pickTag(item, 'pubDate'),
        author: pickTag(item, 'dc:creator') || DEFAULT_AUTHOR,
        thumbnail: extractThumbnail(item, descriptionHtml),
        description: text
          ? `${text.slice(0, MAX_DESCRIPTION_LENGTH).trim()}...`
          : '',
      };
    })
    .filter((article) => article.title && article.link);
}

/**
 * Busca as notícias direto do feed RSS do Pitchfork.
 * Antes usávamos o rss2json.com, mas ele responde com uma página HTML de
 * challenge do Cloudflare (403), o que quebrava o `response.json()`.
 */
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  const response = await fetch(FEED_URL, {
    headers: {
      Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (compatible; MusicPostr/1.0; +https://musicpostr.vercel.app)',
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`O feed RSS respondeu com status ${response.status}`);
  }

  const xml = await response.text();

  if (!xml.includes('<rss') && !xml.includes('<feed')) {
    throw new Error('A resposta do feed RSS não é um XML válido');
  }

  return parseRssItems(xml);
}
