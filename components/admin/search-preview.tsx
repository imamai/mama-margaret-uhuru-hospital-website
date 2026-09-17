/**
 * How a page is likely to appear in a Google result.
 *
 * Deliberately approximate: Google rewrites titles and descriptions when it
 * thinks another wording answers the search better, so this shows the wording
 * you are offering, not a promise of what will be displayed.
 */
export function SearchPreview({
  url,
  title,
  description,
}: {
  url: string
  title: string
  description?: string | null
}) {
  const display = url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const [host, ...segments] = display.split("/")

  return (
    <div className="max-w-xl rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
          M
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs text-foreground">{host}</p>
          <p className="truncate text-xs text-muted-foreground">
            {segments.length ? `https://${host} › ${segments.join(" › ")}` : `https://${host}`}
          </p>
        </div>
      </div>
      <p className="mt-2 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
        {title.length > 60 ? `${title.slice(0, 60)}…` : title}
      </p>
      {description ? (
        <p className="mt-1 text-sm leading-snug text-muted-foreground">
          {description.length > 160 ? `${description.slice(0, 160)}…` : description}
        </p>
      ) : (
        <p className="mt-1 text-sm italic text-muted-foreground opacity-70">
          No description set — Google will pick a sentence from the page instead.
        </p>
      )}
    </div>
  )
}
