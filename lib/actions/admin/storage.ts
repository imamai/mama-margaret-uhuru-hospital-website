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

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Resolves an "image" EntityFormDialog field, which submits an optional
 * `${fieldName}` file input alongside an optional `${fieldName}Url` pasted-URL
 * input. A newly uploaded file wins if both are given. Returns the new URL,
 * `null` on invalid input (bad file type/size, or a malformed URL), or
 * `undefined` when neither was provided (caller should leave the column
 * untouched on update).
 */
export async function resolveImageInput(
  supabase: SupabaseServerClient,
  formData: FormData,
  fieldName: string,
  bucket: string,
  prefix: string
): Promise<string | null | undefined> {
  const file = formData.get(fieldName)
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return null
    if (file.size > MAX_UPLOAD_BYTES) return null
    return uploadPublicFile(supabase, bucket, prefix, file)
  }

  const pastedUrl = formData.get(`${fieldName}Url`)
  if (typeof pastedUrl === "string" && pastedUrl.trim() !== "") {
    const trimmed = pastedUrl.trim()
    if (!isValidImageUrl(trimmed)) return null
    return trimmed
  }

  return undefined
}
