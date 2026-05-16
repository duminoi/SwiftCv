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

  // 2. Extract JSON using bracket counting (more reliable than greedy regex)
  cleaned = extractJson(cleaned);

  // 3. Try parse as-is
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 4. Fix common issues
    let fixed = cleaned;

    // Remove trailing commas before } or ]
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    // Remove double commas
    fixed = fixed.replace(/,,+/g, ',');
    // Fix unquoted keys
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g, '$1"$2"$3');
    // Replace single quotes with double quotes (only for JSON strings, not apostrophes in content)
    fixed = fixSingleQuotes(fixed);
    // Remove JS-style comments
    fixed = fixed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    // Fix unescaped control characters in strings
    fixed = fixControlChars(fixed);

    try {
      return JSON.parse(fixed);
    } catch (e2) {
      // 5. Try to fix missing closing braces/brackets
      const patched = fixMissingBraces(fixed);

      try {
        return JSON.parse(patched);
      } catch (e3) {
        // 6. Last resort: try to find and parse any valid JSON substring
        const found = findValidJson(cleaned);
        if (found !== null) return found;

        console.error('[safeParseJSON] Failed to parse. Raw:', cleaned.substring(0, 500));
        console.error('[safeParseJSON] All attempts failed.');
        throw new Error(`AI returned malformed JSON: ${(e as Error).message}`);
      }
    }
  }
}

// Extract JSON object/array using bracket counting
function extractJson(text: string): string {
  // Find first { or [
  const startIdx = text.search(/[{\[]/);
  if (startIdx === -1) {
    throw new Error('AI returned invalid JSON (no JSON object/array found)');
  }

  const startChar = text[startIdx];
  const endChar = startChar === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (ch === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === startChar) depth++;
    if (ch === endChar) {
      depth--;
      if (depth === 0) {
        return text.substring(startIdx, i + 1);
      }
    }
  }

  // If we get here, brackets are unbalanced - return what we have
  return text.substring(startIdx);
}

// Fix single quotes that wrap JSON strings (not apostrophes inside content)
function fixSingleQuotes(text: string): string {
  // Match single-quoted strings that look like JSON values
  return text.replace(/:\s*'([^']*(?:'[^']*)*)'/g, (match, content) => {
    // Escape any double quotes inside the content
    const escaped = content.replace(/"/g, '\\"');
    return `: "${escaped}"`;
  });
}

// Fix unescaped control characters in JSON strings
function fixControlChars(text: string): string {
  let inString = false;
  let escapeNext = false;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    if (escapeNext) {
      escapeNext = false;
      result += ch;
      continue;
    }

    if (ch === '\\') {
      escapeNext = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString && code < 32 && code !== 9 && code !== 10 && code !== 13) {
      // Replace unescaped control chars with escaped versions
      result += '\\u' + code.toString(16).padStart(4, '0');
    } else {
      result += ch;
    }
  }

  return result;
}

// Fix missing closing braces/brackets
function fixMissingBraces(text: string): string {
  let depth1 = 0; // for {}
  let depth2 = 0; // for []
  let inString = false;
  let escapeNext = false;
  let result = text;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (ch === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') depth1++;
    if (ch === '}') depth1--;
    if (ch === '[') depth2++;
    if (ch === ']') depth2--;
  }

  // Add missing closers
  for (let i = 0; i < depth2; i++) result += ']';
  for (let i = 0; i < depth1; i++) result += '}';

  return result;
}

// Last resort: try to find any valid JSON substring
function findValidJson(text: string): any {
  // Try progressively shorter substrings from the start
  const startIdx = text.search(/[{\[]/);
  if (startIdx === -1) return null;

  for (let endIdx = text.length; endIdx > startIdx; endIdx--) {
    try {
      return JSON.parse(text.substring(startIdx, endIdx));
    } catch {
      continue;
    }
  }
  return null;
}

// ── Hàm gọi AI chính ──
// Ưu tiên: Zen API → OpenRouter → throw error (không dùng demo)
export async function callAI(systemPrompt: string, userPrompt: string, retries = 2): Promise<string> {
  const apiKey = process.env.OPENCODE_API_KEY;
  const routerKey = process.env.OPENROUTER_API_KEY;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (apiKey) {
      try {
        return await callZen(systemPrompt, userPrompt, apiKey);
      } catch (e: any) {
        if (e.message.includes('truncated') && attempt < retries) {
          console.warn(`[callAI] Zen API truncated, retry ${attempt + 1}/${retries}...`);
          continue;
        }
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

    if (attempt === retries) {
      throw new Error('No AI provider available. Set OPENCODE_API_KEY in .env');
    }
  }

  throw new Error('No AI provider available. Set OPENCODE_API_KEY in .env');
}

// ─ Gọi OpenCode Zen API (OpenAI-compatible) ──
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
      max_tokens: 8192,
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
  
  // Check for truncated response (ends mid-JSON)
  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    console.warn('[Zen API] Response was truncated (max_tokens reached), retrying...');
    throw new Error('AI response truncated - retrying');
  }
  
  if (!content || !content.trim()) {
    console.error('[Zen API] AI returned empty content. Full response:', JSON.stringify(data, null, 2).substring(0, 1000));
    throw new Error('AI returned empty response - check API key and model availability');
  }
  
  return content;
}

// ── Fallback: gọi OpenRouter (dùng Gemini Flash free) ──
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
      max_tokens: 8192,
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[OpenRouter] Error ${res.status}:`, errorText.substring(0, 500));
    throw new Error(`OpenRouter ${res.status}: ${errorText}`);
  }
  
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  
  // Check for truncated response
  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    console.warn('[OpenRouter] Response was truncated (max_tokens reached), retrying...');
    throw new Error('AI response truncated - retrying');
  }
  
  if (!content || !content.trim()) {
    console.error('[OpenRouter] AI returned empty content. Full response:', JSON.stringify(data, null, 2).substring(0, 1000));
    throw new Error('OpenRouter AI returned empty response');
  }
  
  return content;
}
