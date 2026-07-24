import { HomepageSectionRow } from "@/components/admin/homepage-section-row"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"

export default async function AdminHomepagePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_homepage_sections")
    .select("id, section_key, title, is_visible, sort_order")
    .order("sort_order", { ascending: true })

  const sections = data ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Homepage Builder</h1>
        <p className="text-muted-foreground">
          Show, hide, and reorder the sections that make up the public homepage.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Reorder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section, i) => (
              <HomepageSectionRow
                key={section.id}
                id={section.id}
                title={section.title ?? section.section_key}
                sectionKey={section.section_key}
                isVisible={section.is_visible}
                isFirst={i === 0}
                isLast={i === sections.length - 1}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
