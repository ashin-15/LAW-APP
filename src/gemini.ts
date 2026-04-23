import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './constants';
import type { Message } from './types';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Use gemini-2.0-flash-lite for maximum free-tier usage (30 RPM, 1500 RPD)
const CHAT_MODEL = 'gemini-2.0-flash-lite';
const ANALYSIS_MODEL = 'gemini-2.0-flash-lite';

// Max conversation history messages to send (keeps token usage low)
const MAX_HISTORY_MESSAGES = 10;

let genAI: GoogleGenAI | null = null;

function getClient(apiKey?: string): GoogleGenAI {
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }
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
  userMessage: string,
  customApiKey?: string
): Promise<string> {
  const client = getClient(customApiKey);

  // Only send recent history to save tokens
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

  // Build conversation history for Gemini
  const contents = recentHistory.map((msg) => ({
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
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 3000,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }
    return text;
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };

    // If rate limited, give a clear message
    if (err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('429')) {
      throw new Error(
        'The AI is currently busy. Please wait a moment and try again. If this persists, the daily quota has been reached — try again tomorrow.'
      );
    }

    console.error('Gemini API error:', err.message);
    throw new Error(
      'Failed to get a response. Please try again. Error: ' +
        (err.message || 'Unknown error')
    );
  }
}

/**
 * Analyze uploaded legal text using a USER-PROVIDED API key.
 * The key is NOT stored — used only for this one-time analysis.
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
${rawText.slice(0, 12000)}
---`;

  try {
    const response = await tempClient.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        maxOutputTokens: 1500,
      },
    });

    const text = response.text || '{}';
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
