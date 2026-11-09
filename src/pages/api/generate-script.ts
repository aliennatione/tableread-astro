import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

export const POST: APIRoute = async ({ request }) => {
  const { sourceText, mode, length, targetLang } = await request.json();
  const apiKey = request.headers.get('x-gemini-key') || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY missing' }), { status: 500 });
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a screenplay writer. Convert the following source into a screenplay in ${targetLang || 'Italian'}.
Mode: ${mode || 'direct'} (direct=faithful, light=minor adaptation, heavy=rework).
Length: ${length || 'full'} (full=complete, summary=synthesis of key points).
Output format: scene headings, action, character cues, dialogue. Keep character names consistent.

SOURCE:
${sourceText}`;
  const res = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
  return new Response(JSON.stringify({ script: res.text }), { headers: { 'Content-Type': 'application/json' } });
};
