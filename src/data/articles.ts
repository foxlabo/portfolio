import { profile, type Article } from './profile';

const LIMIT = 6;

const pick = (xml: string, tag: string) =>
  xml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1].trim() ?? '';

const decode = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');

// note の pubDate は +0900 なので、日本時間の日付で表示する
const toDate = (s: string) => {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(d);
};

async function fetchNote(user: string): Promise<Article[]> {
  const res = await fetch(`https://note.com/${user}/rss`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (portfolio build)' },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => ({
      title: decode(pick(item, 'title')),
      url: pick(item, 'link'),
      date: toDate(pick(item, 'pubDate')),
    }))
    .filter((a) => a.title && a.url.startsWith('https://note.com/'));
}

let cache: Promise<Article[]> | undefined;

/**
 * note の最新記事を返す（ビルド時に 1 回だけ取得）。
 * 取得できないとき（オフラインでのビルドなど）は profile.articles を使う。
 */
export function getArticles(): Promise<Article[]> {
  cache ??= (async () => {
    if (profile.noteUser) {
      try {
        const articles = await fetchNote(profile.noteUser);
        if (articles.length) return articles.slice(0, LIMIT);
      } catch {
        // フォールバックへ
      }
    }
    return profile.articles.slice(0, LIMIT);
  })();
  return cache;
}
