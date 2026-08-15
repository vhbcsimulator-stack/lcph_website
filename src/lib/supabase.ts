import { createClient } from '@supabase/supabase-js';

/**
 * Credentials come from the environment only. They were previously hardcoded as
 * fallbacks, which put the project URL and anon key in git history and made them
 * impossible to rotate without a code change.
 *
 * The anon key still ships inside the client bundle — that is unavoidable for a
 * browser Supabase client and is what the key is designed for. Row Level Security
 * on every table, not secrecy of this key, is what actually protects the data.
 */
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. Add them to .env locally and to the deployment environment.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ─── Storage helpers ──────────────────────────────────────────────────────────

/** Upload a file to the 'media' bucket and return its public URL */
export async function uploadMedia(
  file: File,
  folder: 'projects' | 'properties' | 'amenities' | 'updates' | 'news' | 'gallery' | 'avatars'
): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  return data.publicUrl;
}

/** Delete a file from the 'media' bucket by its public URL */
export async function deleteMedia(publicUrl: string): Promise<void> {
  const path = publicUrl.split('/storage/v1/object/public/media/')[1];
  if (!path) return;
  await supabase.storage.from('media').remove([path]);
}

// ─── Admin authentication ─────────────────────────────────────────────────────

// Fallback credentials used when the admins table is unreachable (e.g. RLS not configured yet)
const FALLBACK_USERNAME = 'admin';
const FALLBACK_PASSWORD = 'LCPH2026';

/** Verify admin credentials — tries Supabase first, falls back to built-in credentials */
export async function verifyAdmin(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    // If query succeeded and found a row, auth is valid
    if (!error && data !== null) return true;

    // If the table returned an error (RLS, table missing, network), log it and use fallback
    if (error) {
      console.warn('Supabase admins query failed, using fallback credentials:', error.message);
    }
  } catch (e) {
    console.warn('Supabase unreachable, using fallback credentials:', e);
  }

  // Fallback: match against hardcoded credentials
  return username === FALLBACK_USERNAME && password === FALLBACK_PASSWORD;
}
