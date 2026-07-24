import "server-only"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const listOpenJobs = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("margaret_jobs")
    .select(
      "id, title, slug, department_id, location, contract_type, application_deadline, positions_available"
    )
    .eq("status", "published")
    .gte("application_deadline", new Date().toISOString().slice(0, 10))
    .order("application_deadline", { ascending: true })
  return data ?? []
})

export const getJobBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data: job } = await supabase
    .from("margaret_jobs")
    .select(
      "id, title, slug, department_id, location, contract_type, qualifications, experience_required, responsibilities, salary_range, description, application_deadline, positions_available, attachments"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!job) return null

  const department = job.department_id
    ? (
        await supabase
          .from("margaret_departments")
          .select("id, name, slug")
          .eq("id", job.department_id)
          .maybeSingle()
      ).data
    : null

  return { ...job, department }
})

export const isJobOpen = (deadline: string) => new Date(deadline) >= new Date(new Date().toDateString())
