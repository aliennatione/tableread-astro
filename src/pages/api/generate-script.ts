import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const Body = z.object({
  sourceText: z.string().min(1).max(200000),
  mode: z.enum(['direct','light','heavy']).default('direct'),
  length: z.enum(['full','summary']).default('full'),
  targetLang: z.string().default('Italian'),
});

export const POST: APIRoute = async ({ request }) => {
  let body;
  try { body = Body.parse(await request.json()); } catch (e:any) {
    return new Response(JSON.stringify({ error: 'invalid body', details: e.errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const apiKey = request.headers.get('x-gemini-key') || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a screenplay writer. Convert the following source into a screenplay in ${body.targetLang}.
Mode: ${body.mode} (direct=faithful, light=minor adaptation, heavy=rework).
Length: ${body.length} (full=complete, summary=synthesis of key points).
Output format: scene headings, action, character cues, dialogue. Keep character names consistent.

SOURCE:
${body.sourceText}`;
  const res = await ai.models.generateContent({ model: 'gemini-3.8-flash', contents: prompt });
  return new Response(JSON.stringify({ script: res.text }), { headers: { 'Content-Type': 'application/json' } });
};
