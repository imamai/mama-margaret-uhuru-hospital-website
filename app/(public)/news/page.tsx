import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { listNews, listNewsCategories } from "@/lib/data/news"

export const metadata: Metadata = {
  title: "News",
  description: "Latest news, announcements, and press updates.",
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const [news, categories] = await Promise.all([
    listNews({ categorySlug: category }),
    listNewsCategories(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Stay informed" title="Latest News" align="left" className="max-w-none" />

      {categories.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/news">
            <Badge variant={!category ? "default" : "outline"}>All</Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/news?category=${cat.slug}`}>
              <Badge variant={category === cat.slug ? "default" : "outline"}>{cat.name}</Badge>
            </Link>
          ))}
        </div>
      ) : null}

      {news.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No articles published yet. Please check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <Card key={article.id} className="overflow-hidden py-0">
              <Link href={`/news/${article.slug}`} className="group">
                <div className="relative h-44">
                  <SmartImage src={article.featured_image_url} alt={article.title} />
                  {article.is_breaking ? (
                    <Badge variant="destructive" className="absolute top-3 left-3">
                      Breaking
                    </Badge>
                  ) : null}
                </div>
                <CardContent className="py-5">
                  {article.published_at ? (
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.published_at).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  ) : null}
                  <h2 className="mt-1 font-semibold text-foreground group-hover:text-primary">{article.title}</h2>
                  {article.excerpt ? (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                  ) : null}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
