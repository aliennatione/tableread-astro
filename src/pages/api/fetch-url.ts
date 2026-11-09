import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { url } = await request.json();
  const r = await fetch(url);
  const html = await r.text();
  const { load } = await import('cheerio');
  const $ = load(html);
  const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 200000);
  return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } });
};
