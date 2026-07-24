import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/common/section-heading"
import { SmartImage } from "@/components/common/smart-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { listNews } from "@/lib/data/news"

export async function NewsGrid() {
  const news = await listNews({ limit: 3 })
  if (news.length === 0) return null

  return (
    <section aria-labelledby="news-heading" className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading eyebrow="Stay informed" title="Latest News" />
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
                <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">{article.title}</h3>
                {article.excerpt ? (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                ) : null}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/news">
            View all news <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
