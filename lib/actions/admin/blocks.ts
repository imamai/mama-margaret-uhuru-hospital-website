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

type Kind = "heading" | "ordered" | "bullet" | "image" | "text"

function kindOf(line: string): Kind {
  if (HEADING.test(line)) return "heading"
  if (IMAGE.test(line)) return "image"
  if (ORDERED.test(line)) return "ordered"
  if (BULLET.test(line)) return "bullet"
  return "text"
}

/**
 * Reads one blank-line-separated chunk into blocks.
 *
 * A chunk can hold more than one block. Writing
 *
 *   ## Services
 *   - One
 *   - Two
 *
 * with no blank line after the heading is what anyone actually types, and it
 * used to come out as a single paragraph with the "##" and the dashes printed
 * literally on the page. So lines are grouped by kind instead: a heading or an
 * image is its own block, consecutive list lines are one list, and everything
 * else gathers into a paragraph.
 */
function chunkToBlocks(chunk: string): Block[] {
  const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean)
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const kind = kindOf(lines[i])

    if (kind === "heading") {
      const [, hashes, text] = lines[i].match(HEADING)!
      blocks.push({ type: "header", data: { level: hashes.length, text: text.trim() } })
      i += 1
      continue
    }

    if (kind === "image") {
      const [, caption, url] = lines[i].match(IMAGE)!
      blocks.push({ type: "image", data: { url, caption } })
      i += 1
      continue
    }

    const run: string[] = []
    while (i < lines.length && kindOf(lines[i]) === kind) {
      run.push(lines[i])
      i += 1
    }

    if (kind === "ordered" || kind === "bullet") {
      const marker = kind === "ordered" ? ORDERED : BULLET
      blocks.push({
        type: "list",
        data: { style: kind === "ordered" ? "ordered" : "unordered", items: run.map((l) => l.replace(marker, "")) },
      })
    } else {
      blocks.push({ type: "paragraph", data: { text: run.join("\n") } })
    }
  }

  return blocks
}

/** Converts the admin's plain-text body field into the CMS's `{ blocks }` jsonb shape. */
export function textToBlocks(text: string): { blocks: Block[] } {
  const chunks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  return { blocks: chunks.flatMap(chunkToBlocks) }
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

/**
 * The opening paragraph with the syntax stripped, for places that need one
 * line of plain prose: a card excerpt, a meta description, a search result.
 * Those cannot render a list, and "### Services" is not a summary of anything.
 */
export function plainExcerpt(text: string | null | undefined): string {
  if (!text) return ""
  const first =
    text
      .replace(/\r\n/g, "\n")
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .find(Boolean) ?? ""

  return first
    .split("\n")
    .map((line) => line.replace(HEADING, "$2").replace(ORDERED, "").replace(BULLET, "").trim())
    .filter(Boolean)
    .join(" ")
}

/** Inverse of textToBlocks, for populating the edit form from stored content. */
export function blocksToText(content: unknown): string {
  const blocks = (content as { blocks?: Block[] } | null)?.blocks ?? []
  return blocks
    .map(fromBlock)
    .filter((s): s is string => s !== null && s !== "")
    .join("\n\n")
}
