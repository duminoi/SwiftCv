// Storage layer: uses @vercel/postgres on Vercel, file-based for local dev with persistence

import fs from 'fs';
import path from 'path';

const isVercel = !!process.env.VERCEL;
const DB_FILE = path.join(process.cwd(), 'data', 'cvs.json');

interface CVRecord {
  user_id: string;
  id: string;
  name: string;
  data: any;
  template: string;
  primary_color: string;
  font_family: string;
  updated_at: string;
}

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read from file
function readDB(): Map<string, CVRecord[]> {
  ensureDataDir();
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, '{}', 'utf-8');
      return new Map();
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const obj = JSON.parse(content);
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

// Write to file
function writeDB(db: Map<string, CVRecord[]>) {
  ensureDataDir();
  const obj = Object.fromEntries(db);
  fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf-8');
}

// In-memory cache (loaded from file on startup)
let localStore: Map<string, CVRecord[]> = readDB();

// Sync to file after writes
function persist() {
  writeDB(localStore);
}

async function queryLocal(text: string, params?: any[]): Promise<{ rows: any[] }> {
  if (text.includes('SELECT') && text.includes('FROM cvs')) {
    const rows = params?.[0] ? (localStore.get(params[0] as string) || []) : [];
    return { rows };
  }
  return { rows: [] };
}

export async function query(text: string, params?: any[]): Promise<{ rows: any[] }> {
  if (isVercel) {
    const { sql } = await import('@vercel/postgres');
    return sql.query(text, params);
  }
  return queryLocal(text, params);
}

export async function getCVs(userId: string): Promise<CVRecord[]> {
  if (isVercel) {
    const { rows } = await query('SELECT * FROM cvs WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    return rows as CVRecord[];
  }
  return localStore.get(userId) || [];
}

export async function saveCV(userId: string, record: CVRecord): Promise<void> {
  if (isVercel) {
    await query(
      `INSERT INTO cvs (user_id, id, name, data, template, primary_color, font_family, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET name=$3, data=$4, template=$5, primary_color=$6, font_family=$7, updated_at=$8`,
      [userId, record.id, record.name, JSON.stringify(record.data), record.template, record.primary_color, record.font_family, record.updated_at]
    );
    return;
  }
  const existing = localStore.get(userId) || [];
  const idx = existing.findIndex(c => c.id === record.id);
  if (idx >= 0) existing[idx] = record;
  else existing.push(record);
  localStore.set(userId, existing);
  persist();
}

export async function deleteCV(userId: string, cvId: string): Promise<void> {
  if (isVercel) {
    await query('DELETE FROM cvs WHERE user_id = $1 AND id = $2', [userId, cvId]);
    return;
  }
  const existing = localStore.get(userId) || [];
  localStore.set(userId, existing.filter(c => c.id !== cvId));
  persist();
}

// ── Auth helpers (for future Clerk integration) ──

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  tier: 'free' | 'pro' | 'business' | 'lifetime';
  createdAt: string;
}

const AUTH_FILE = path.join(process.cwd(), 'data', 'auth.json');

function readAuthDB(): Map<string, AuthUser> {
  ensureDataDir();
  try {
    if (!fs.existsSync(AUTH_FILE)) {
      fs.writeFileSync(AUTH_FILE, '{}', 'utf-8');
      return new Map();
    }
    const content = fs.readFileSync(AUTH_FILE, 'utf-8');
    const obj = JSON.parse(content);
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

function writeAuthDB(db: Map<string, AuthUser>) {
  ensureDataDir();
  const obj = Object.fromEntries(db);
  fs.writeFileSync(AUTH_FILE, JSON.stringify(obj, null, 2), 'utf-8');
}

export function getUser(userId: string): AuthUser | undefined {
  return readAuthDB().get(userId);
}

export function createUser(user: AuthUser): void {
  const db = readAuthDB();
  db.set(user.id, user);
  writeAuthDB(db);
}

export function updateUserTier(userId: string, tier: AuthUser['tier']): void {
  const db = readAuthDB();
  const user = db.get(userId);
  if (user) {
    user.tier = tier;
    db.set(userId, user);
    writeAuthDB(db);
  }
}
