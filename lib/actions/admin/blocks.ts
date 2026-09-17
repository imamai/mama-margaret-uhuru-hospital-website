/**
 * The admin's body field is plain text; the site stores `{ blocks }` jsonb
 * (see components/common/block-content.tsx). These two functions translate
 * between them, and they have to be exact inverses.
 *
 * They were not. The text version kept only paragraphs, so opening a page with
 * a heading or a list in the admin showed neither — and saving it wrote back
 * paragraphs alone, deleting the rest. The About page carries five headings and
 * a numbered list of core values; one ordinary edit would have erased them.
 *
 * So the text form now has just enough syntax to carry every block the site
 * renders, one block per paragraph-separated chunk:
 *
 *   ## Heading            a level-2 heading   (### for level 3)
 *   1. First item         a numbered list, one item per line
 *   - Item                a bulleted list, one item per line
 *   ![Caption](https://…) an image
 *   anything else         a paragraph
 *
 * Plain text with none of these is read exactly as before.
 */

type Block = { type: string; data: Record<string, unknown> }

const HEADING = /^(#{2,4})\s+(.+)$/
const ORDERED = /^\d+[.)]\s+/
const BULLET = /^[-*•]\s+/
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/

function toBlock(chunk: string): Block {
  const heading = chunk.match(HEADING)
  if (heading && !chunk.includes("\n")) {
    return { type: "header", data: { level: heading[1].length, text: heading[2].trim() } }
  }

  const image = chunk.match(IMAGE)
  if (image) {
    return { type: "image", data: { url: image[2], caption: image[1] } }
  }

  const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean)

  if (lines.length > 0 && lines.every((l) => ORDERED.test(l))) {
    return { type: "list", data: { style: "ordered", items: lines.map((l) => l.replace(ORDERED, "")) } }
  }
  if (lines.length > 0 && lines.every((l) => BULLET.test(l))) {
    return { type: "list", data: { style: "unordered", items: lines.map((l) => l.replace(BULLET, "")) } }
  }

  return { type: "paragraph", data: { text: chunk } }
}

/** Converts the admin's plain-text body field into the CMS's `{ blocks }` jsonb shape. */
export function textToBlocks(text: string): { blocks: Block[] } {
  const chunks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  return { blocks: chunks.map(toBlock) }
}

function fromBlock(block: Block): string | null {
  const d = block.data ?? {}
  switch (block.type) {
    case "paragraph":
      return String(d.text ?? "")
    case "header": {
      const level = Math.min(Math.max(Number(d.level ?? 2), 2), 4)
      return `${"#".repeat(level)} ${String(d.text ?? "")}`
    }
    case "list": {
      const items = (d.items as unknown[] | undefined) ?? []
      const ordered = d.style === "ordered"
      return items.map((item, i) => (ordered ? `${i + 1}. ${String(item)}` : `- ${String(item)}`)).join("\n")
    }
    case "image":
      return d.url ? `![${String(d.caption ?? "")}](${String(d.url)})` : null
    default:
      // The site renders only the four types above, and this editor can create
      // every one of them, so nothing else exists to lose. Text standing in for
      // an unknown block would be saved back as a paragraph and published.
      return null
  }
}

/** Inverse of textToBlocks, for populating the edit form from stored content. */
export function blocksToText(content: unknown): string {
  const blocks = (content as { blocks?: Block[] } | null)?.blocks ?? []
  return blocks
    .map(fromBlock)
    .filter((s): s is string => s !== null && s !== "")
    .join("\n\n")
}
