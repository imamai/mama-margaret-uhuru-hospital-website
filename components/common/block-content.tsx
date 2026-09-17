type Block = {
  type: string
  data: Record<string, unknown>
}

/**
 * Renders the CMS's block-based rich content (`{ blocks: [...] }` jsonb,
 * editor-agnostic). Only a handful of block types are seeded so far --
 * unknown types are skipped rather than crashing the page.
 *
 * Every block carries its own type styling. This used to lean on `prose` from
 * @tailwindcss/typography, which is not installed here, so the classes did
 * nothing and Tailwind's own reset took over: headings dropped to body size,
 * paragraphs lost their spacing, and list markers disappeared. A long page
 * like About then read as one undifferentiated wall of text.
 *
 * Spacing is asymmetric on purpose -- a heading sits close to the text it
 * introduces and further from the section it follows, so the page breaks into
 * sections at a glance rather than on a careful read.
 */

const HEADINGS: Record<number, string> = {
  2: "mt-12 mb-3 border-t pt-8 text-xl font-bold tracking-tight text-foreground first:mt-0 first:border-t-0 first:pt-0 sm:text-2xl",
  3: "mt-8 mb-2 text-lg font-semibold tracking-tight text-foreground first:mt-0",
  4: "mt-6 mb-2 text-base font-semibold text-foreground first:mt-0",
}

/**
 * A list item written as "Term — explanation" is a definition, and the term is
 * what a reader scans for, so it is set in the page's own colour and weight.
 * Guarded by length: only a short lead-in is a term, and an em dash in the
 * middle of a sentence is just punctuation.
 */
function ListItemText({ text }: { text: string }) {
  const at = text.indexOf(" — ")
  if (at > 0 && at <= 48) {
    return (
      <>
        <strong className="font-semibold text-foreground">{text.slice(0, at)}</strong>
        {text.slice(at)}
      </>
    )
  }
  return <>{text}</>
}

export function BlockContent({ content }: { content: unknown }) {
  const blocks = (content as { blocks?: Block[] } | null)?.blocks ?? []

  if (blocks.length === 0) return null

  return (
    <div className="text-base leading-7 text-muted-foreground">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="mb-4 last:mb-0">
                {String(block.data.text ?? "")}
              </p>
            )

          case "header": {
            const level = Math.min(Math.max(Number(block.data.level ?? 2), 2), 4)
            const Tag = (`h${level}` as unknown) as "h2" | "h3" | "h4"
            return (
              <Tag key={i} className={HEADINGS[level]}>
                {String(block.data.text ?? "")}
              </Tag>
            )
          }

          case "list": {
            const items = (block.data.items as string[] | undefined) ?? []
            const ordered = block.data.style === "ordered"
            const ListTag = ordered ? "ol" : "ul"
            return (
              <ListTag
                key={i}
                className={`mb-5 ml-5 space-y-2 last:mb-0 marker:font-medium marker:text-brand-deep dark:marker:text-brand-accent ${
                  ordered ? "list-decimal" : "list-disc"
                }`}
              >
                {items.map((item, j) => (
                  <li key={j} className="pl-1.5">
                    <ListItemText text={item} />
                  </li>
                ))}
              </ListTag>
            )
          }

          case "image": {
            const url = block.data.url as string | undefined
            if (!url) return null
            const caption = String(block.data.caption ?? "")
            return (
              <figure key={i} className="my-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={caption} className="w-full rounded-xl" />
                {caption ? (
                  <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption>
                ) : null}
              </figure>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
