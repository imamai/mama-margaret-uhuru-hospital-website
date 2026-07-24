import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"

import { ApplicationStatusSelect } from "@/components/admin/application-status-select"
import { ExportCsvButton } from "@/components/admin/export-csv-button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase.from("margaret_jobs").select("id, title").eq("id", id).maybeSingle()
  if (!job) notFound()

  const { data: applications } = await supabase
    .from("margaret_job_applications")
    .select("id, full_name, email, phone, cover_letter, status, created_at")
    .eq("job_id", id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  const applicationIds = (applications ?? []).map((a) => a.id)

  const { data: documents } = applicationIds.length
    ? await supabase
        .from("margaret_job_application_documents")
        .select("id, application_id, document_type, file_url, file_name")
        .in("application_id", applicationIds)
    : { data: [] }

  const documentsByApplication = new Map<string, { document_type: string; file_name: string | null; signedUrl: string | null }[]>()

  for (const doc of documents ?? []) {
    const { data: signed } = await supabase.storage.from("job-attachments").createSignedUrl(doc.file_url, 60 * 10)
    const list = documentsByApplication.get(doc.application_id) ?? []
    list.push({ document_type: doc.document_type, file_name: doc.file_name, signedUrl: signed?.signedUrl ?? null })
    documentsByApplication.set(doc.application_id, list)
  }

  return (
    <div>
      <Link href="/admin/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to Jobs
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications: {job.title}</h1>
          <p className="text-muted-foreground">{applications?.length ?? 0} applicant(s)</p>
        </div>
        <ExportCsvButton
          rows={applications ?? []}
          columns={[
            { key: "full_name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "status", label: "Status" },
            { key: "created_at", label: "Applied At" },
          ]}
          filename={`${job.title.replace(/\s+/g, "-").toLowerCase()}-applications.csv`}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(applications ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No applications yet.
                </TableCell>
              </TableRow>
            ) : (
              (applications ?? []).map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium text-foreground">{application.full_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{application.email}</div>
                    <div>{application.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {(documentsByApplication.get(application.id) ?? []).map((doc, i) =>
                        doc.signedUrl ? (
                          <a
                            key={i}
                            href={doc.signedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-brand-deep hover:underline dark:text-brand-accent"
                          >
                            <FileText className="size-3.5" aria-hidden="true" />
                            {doc.document_type.replace("_", " ")}
                          </a>
                        ) : null
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(application.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Badge variant={application.status === "hired" ? "default" : "outline"} className="hidden sm:inline-flex">
                        {application.status}
                      </Badge>
                      <ApplicationStatusSelect id={application.id} jobId={job.id} status={application.status} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
