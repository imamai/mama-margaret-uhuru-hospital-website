import type { createClient } from "@/lib/supabase/server"

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/** Uploads a file to a public bucket under `${prefix}/${timestamp}-${filename}` and returns its public URL, or null on failure. */
export async function uploadPublicFile(
  supabase: SupabaseServerClient,
  bucket: string,
  prefix: string,
  file: File
): Promise<string | null> {
  const path = `${prefix}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return null

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}
