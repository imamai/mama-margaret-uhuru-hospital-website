/** Converts the admin's plain-text body field into the CMS's `{ blocks }` jsonb shape (see components/common/block-content.tsx). */
export function textToBlocks(text: string): { blocks: { type: string; data: Record<string, unknown> }[] } {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  return { blocks: paragraphs.map((text) => ({ type: "paragraph", data: { text } })) }
}

/** Inverse of textToBlocks, for populating the edit form from stored content. */
export function blocksToText(content: unknown): string {
  const blocks = (content as { blocks?: { type: string; data: Record<string, unknown> }[] } | null)?.blocks ?? []
  return blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => String(b.data.text ?? ""))
    .join("\n\n")
}
