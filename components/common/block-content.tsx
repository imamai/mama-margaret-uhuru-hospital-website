type Block = {
  type: string
  data: Record<string, unknown>
}

/**
 * Renders the CMS's block-based rich content (`{ blocks: [...] }` jsonb,
 * editor-agnostic). Only a handful of block types are seeded so far --
 * unknown types are skipped rather than crashing the page.
 */
export function BlockContent({ content }: { content: unknown }) {
  const blocks = (content as { blocks?: Block[] } | null)?.blocks ?? []

  if (blocks.length === 0) return null

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return <p key={i}>{String(block.data.text ?? "")}</p>
          case "header": {
            const level = Number(block.data.level ?? 2)
            const Tag = (`h${Math.min(Math.max(level, 2), 4)}` as unknown) as "h2" | "h3" | "h4"
            return <Tag key={i}>{String(block.data.text ?? "")}</Tag>
          }
          case "list": {
            const items = (block.data.items as string[] | undefined) ?? []
            const ordered = block.data.style === "ordered"
            const ListTag = ordered ? "ol" : "ul"
            return (
              <ListTag key={i}>
                {items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ListTag>
            )
          }
          case "image": {
            const url = block.data.url as string | undefined
            if (!url) return null
            // eslint-disable-next-line @next/next/no-img-element
            return <img key={i} src={url} alt={String(block.data.caption ?? "")} className="rounded-xl" />
          }
          default:
            return null
        }
      })}
    </div>
  )
}
