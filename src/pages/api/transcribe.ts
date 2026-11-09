import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

export const POST: APIRoute = async ({ request }) => {
  const { audioBase64, mimeType } = await request.json();
  const apiKey = request.headers.get('x-gemini-key') || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY missing' }), { status: 500 });
  const ai = new GoogleGenAI({ apiKey });
  const res = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [{ role: 'user', parts: [{ inlineData: { data: audioBase64, mimeType: mimeType || 'audio/mp3' } }, { text: 'Transcribe this audio verbatim.' }] }],
  });
  return new Response(JSON.stringify({ transcript: res.text }), { headers: { 'Content-Type': 'application/json' } });
};
