import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockContent } from "@/components/common/block-content"
import { SmartImage } from "@/components/common/smart-image"
import { Badge } from "@/components/ui/badge"
import { getNewsBySlug } from "@/lib/data/news"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { articleJsonLd, pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } }
  return pageMetadata({
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    path: `/news/${article.slug}`,
    image: article.featured_image_url,
    type: "article",
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    authors: article.author_name ? [article.author_name] : undefined,
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt,
          path: `/news/${article.slug}`,
          image: article.featured_image_url,
          publishedAt: article.published_at,
          updatedAt: article.updated_at,
          authorName: article.author_name,
        })}
      />
      <Breadcrumbs items={[{ name: "News", path: "/news" }, { name: article.title, path: `/news/${article.slug}` }]} />

      {article.is_breaking ? <Badge variant="destructive" className="mt-6">Breaking</Badge> : null}
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{article.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {article.author_name ? <span>{article.author_name}</span> : null}
        {article.published_at ? (
          <span>
            {article.author_name ? "· " : ""}
            {new Date(article.published_at).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        ) : null}
      </div>

      {article.featured_image_url ? (
        <div className="relative mt-6 h-64 overflow-hidden rounded-2xl sm:h-96">
          <SmartImage src={article.featured_image_url} alt={article.title} />
        </div>
      ) : null}

      <div className="mt-8">
        <BlockContent content={article.content} />
        {!article.content || (article.content as { blocks?: unknown[] }).blocks?.length === 0 ? (
          <p className="text-muted-foreground">{article.excerpt}</p>
        ) : null}
      </div>

      {article.tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  )
}
