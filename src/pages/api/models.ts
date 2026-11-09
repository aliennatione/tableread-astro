import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

const SUITABLE = (name: string) => /gemini|flash|pro/i.test(name) && !/embed|aqa|imagen/i.test(name);

export const GET: APIRoute = async ({ request }) => {
  const apiKey = request.headers.get('x-gemini-key') || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const ai = new GoogleGenAI({ apiKey });
  const models = await ai.models.list();
  const usable = (models as any).models
    ?.filter((m:any)=> m.supportedGenerationMethods?.includes('generateContent'))
    ?.map((m:any)=>m.name?.replace(/^models\//,''))
    ?.filter((n:string)=> n && SUITABLE(n)) || [];
  return new Response(JSON.stringify({ models: usable }), { headers: { 'Content-Type': 'application/json' } });
};
