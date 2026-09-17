/**
 * Emits a JSON-LD block. Structured data must be in the server-rendered HTML --
 * Google's crawler does run JavaScript, but it does so on a separate, slower
 * pass, so schema injected on the client is schema that may not be read.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  )
}
