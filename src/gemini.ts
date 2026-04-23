import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './constants';
import type { Message } from './types';

const API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genAI) {
    if (!API_KEY) {
      throw new Error('Gemini API key not configured. Please check your .env.local file.');
    }
    genAI = new GoogleGenAI({ apiKey: API_KEY });
  }
  return genAI;
}

export async function sendChatMessage(
  history: Message[],
  userMessage: string
): Promise<string> {
  const client = getClient();

  // Build conversation history for Gemini
  const contents = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Add the new user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }
    return text;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Gemini API error:', err.message);
    throw new Error(
      'Failed to get a response from the AI. Please try again. Error: ' +
        (err.message || 'Unknown error')
    );
  }
}

/**
 * Analyze uploaded legal text using a USER-PROVIDED API key.
 * The key is NOT stored — it is used only for this one-time analysis.
 */
export async function analyzeDocumentWithUserKey(
  userApiKey: string,
  rawText: string
): Promise<{ title: string; sections: string[] }> {
  const tempClient = new GoogleGenAI({ apiKey: userApiKey });

  const prompt = `You are a legal document analyzer specializing in Indian law. Analyze the following legal text and return a JSON object with:
1. "title" — a short descriptive title for this legal document
2. "sections" — an array of strings, each being a key section/provision/clause found in the text

IMPORTANT: Return ONLY valid JSON, no markdown fences, no explanation.

TEXT TO ANALYZE:
---
${rawText.slice(0, 15000)}
---`;

  try {
    const response = await tempClient.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text || '{}';
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || 'Untitled Document',
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    };
  } catch (error: unknown) {
    const err = error as { message?: string };
    throw new Error(
      'Failed to analyze document. Please check your API key and try again. Error: ' +
        (err.message || 'Unknown error')
    );
  }
}
