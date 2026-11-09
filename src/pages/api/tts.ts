import type { APIRoute } from 'astro';
import { synthesizeConversational, type TurnRequest } from '../../server/geminiTts';

export const POST: APIRoute = async ({ request }) => {
  const { turns, speakers } = await request.json() as { turns: TurnRequest[]; speakers: { speaker: string; voice: string }[] };
  const apiKey = request.headers.get('x-gemini-key') || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY missing' }), { status: 500 });
  try {
    const audio = await synthesizeConversational(apiKey, turns, speakers);
    return new Response(JSON.stringify({ audio }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
