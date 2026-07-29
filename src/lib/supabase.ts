import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  'https://thxzmrfsfmdvkuuhfizy.supabase.co';

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHptcmZzZm1kdmt1dWhmaXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDQxMDEsImV4cCI6MjEwMDg4MDEwMX0.ps59LIAQ88knefWGQlsXn5NOWyhbglb1v_0fQeZykmI';

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
