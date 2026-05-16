import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

// Load .env từ thư mục gốc project (F:\Projects\SwiftCv\.env)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

// ── Helper: parse JSON từ AI response, tự sửa lỗi phổ biến ──
export function safeParseJSON(text: string): any {
  if (!text || !text.trim()) {
    throw new Error('AI returned empty response');
  }

  // 1. Remove markdown code blocks
  let cleaned = text
    .replace(/```(?:json)?\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // 2. Extract first JSON object/array
  const jsonMatch = cleaned.match(/(?:\[|{)[\s\S]*(?:\]|})/);
  if (!jsonMatch) {
    throw new Error('AI returned invalid JSON (no JSON object/array found)');
  }
  cleaned = jsonMatch[0];

  // 3. Try parse as-is
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 4. Fix common issues
    let fixed = cleaned;

    // Remove trailing commas before } or ]
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    // Remove double commas
    fixed = fixed.replace(/,(\s*,)/g, ',');
    // Fix unquoted keys
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
    // Replace single quotes with double quotes (careful: don't break apostrophes in words)
    fixed = fixed.replace(/'([^']*?)'/g, '"$1"');
    // Remove comments
    fixed = fixed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    // Fix escaped newlines that aren't properly quoted
    fixed = fixed.replace(/\n/g, '\\n');

    try {
      return JSON.parse(fixed);
    } catch (e2) {
      // 5. Try to fix missing closing braces by counting open/close
      const openBraces = (fixed.match(/{/g) || []).length;
      const closeBraces = (fixed.match(/}/g) || []).length;
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;

      let patched = fixed;
      for (let i = 0; i < openBraces - closeBraces; i++) patched += '}';
      for (let i = 0; i < openBrackets - closeBrackets; i++) patched += ']';

      try {
        return JSON.parse(patched);
      } catch (e3) {
        console.error('[safeParseJSON] Failed to parse. Raw:', cleaned.substring(0, 500));
        console.error('[safeParseJSON] Patched attempt:', patched.substring(0, 500));
        throw new Error(`AI returned malformed JSON: ${(e as Error).message}`);
      }
    }
  }
}

// ── Hàm gọi AI chính ──
// Ưu tiên: Zen API → OpenRouter → throw error (không dùng demo)
export async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENCODE_API_KEY;
  const routerKey = process.env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      return await callZen(systemPrompt, userPrompt, apiKey);
    } catch (e) {
      console.warn('Zen API failed, falling back...', e);
    }
  }

  if (routerKey) {
    try {
      return await callOpenRouter(systemPrompt, userPrompt, routerKey);
    } catch (e) {
      console.warn('OpenRouter failed', e);
    }
  }

  throw new Error('No AI provider available. Set OPENCODE_API_KEY in .env');
}

// ── Gọi OpenCode Zen API (OpenAI-compatible) ──
async function callZen(system: string, user: string, apiKey: string): Promise<string> {
  const zenUrl = process.env.ZEN_API_URL || 'https://opencode.ai/zen/v1/chat/completions';
  const model = process.env.ZEN_MODEL || 'big-pickle';
  
  console.log(`[Zen API] Calling ${zenUrl} with model ${model}`);
  
  const res = await fetch(zenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });
  
  const rawText = await res.text();
  console.log(`[Zen API] Status: ${res.status}, Response length: ${rawText.length}`);
  
  if (!res.ok) {
    console.error(`[Zen API] Error response:`, rawText.substring(0, 500));
    throw new Error(`Zen API ${res.status}: ${rawText}`);
  }

  if (!rawText || !rawText.trim()) {
    throw new Error('Zen API returned empty response body');
  }
  
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    console.error('[Zen API] Failed to parse JSON. Raw response:', rawText.substring(0, 500));
    throw new Error(`Zen API returned invalid JSON: ${rawText.substring(0, 200)}`);
  }

  const content = data?.choices?.[0]?.message?.content || '';
  console.log(`[Zen API] Response content length: ${content.length}`);
  
  if (!content || !content.trim()) {
    console.error('[Zen API] AI returned empty content. Full response:', JSON.stringify(data, null, 2).substring(0, 1000));
    throw new Error('AI returned empty response - check API key and model availability');
  }
  
  return content;
}

// ─ Fallback: gọi OpenRouter (dùng Gemini Flash free) ──
async function callOpenRouter(system: string, user: string, routerKey: string): Promise<string> {
  console.log('[OpenRouter] Calling OpenRouter API...');
  
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${routerKey}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[OpenRouter] Error ${res.status}:`, errorText.substring(0, 500));
    throw new Error(`OpenRouter ${res.status}: ${errorText}`);
  }
  
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  
  if (!content || !content.trim()) {
    console.error('[OpenRouter] AI returned empty content. Full response:', JSON.stringify(data, null, 2).substring(0, 1000));
    throw new Error('OpenRouter AI returned empty response');
  }
  
  return content;
}
