"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface TenderDocument {
  id: string
  title: string
  fileUrl: string | null
  mustReturn: boolean
}

/**
 * The tender pack, to download.
 *
 * Quotations are delivered sealed, by hand, courier or post, and opened in
 * public at the closing time. So there is nothing to upload here and no price
 * to type: a figure entered on a web form before the opening is a sealed bid
 * that was not sealed. This screen hands over the documents and says plainly
 * what to do with them.
 *
 * Forms that have to come back are listed separately from documents that are
 * only to be read, because the hospital's own rules reject a quotation missing
 * any of them at preliminary examination.
 *
 * The steps begin at "download", because that is genuinely the first thing to
 * do and the old list opened at "complete every form" as though the forms had
 * arrived by themselves.
 */
export function TenderDocuments({
  tenderNumber,
  tenderTitle,
  closingDate,
  address,
  documents,
}: {
  tenderNumber: string | null
  tenderTitle: string
  closingDate: string | null
  address: string | null
  documents: TenderDocument[]
}) {
  const [open, setOpen] = useState(false)

  const downloadable = documents.filter((doc) => doc.fileUrl)
  const mustReturn = documents.filter((doc) => doc.mustReturn)

  const closing = closingDate
    ? new Date(closingDate).toLocaleString("en-KE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={downloadable.length > 0 ? "default" : "outline"}>
          <Download className="size-4" aria-hidden="true" /> Tender documents
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tenderTitle}</DialogTitle>
          <DialogDescription>{tenderNumber}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold">Documents</h3>
            {downloadable.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No documents have been published for this tender yet. Contact the procurement office.
              </p>
            ) : (
              <ul className="mt-2 divide-y rounded-lg border">
                {downloadable.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.fileUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted"
                    >
                      <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="min-w-0 flex-1">{doc.title}</span>
                      <Download className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {mustReturn.length > 0 ? (
            <section>
              <h3 className="text-sm font-semibold">Complete, sign, stamp and return</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                A quotation missing any of these can be rejected at preliminary examination.
              </p>
              <ul className="mt-2 space-y-1.5">
                {mustReturn.map((doc) => (
                  <li key={doc.id} className="flex items-start gap-2 text-sm">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-deep" />
                    <span>{doc.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-lg border bg-muted/40 p-4">
            <h3 className="text-sm font-semibold">What to do next</h3>
            {/* A real ordered list, numbered by the browser. The numbers used to
                be typed into each item, so inserting this download step meant
                renumbering every one by hand -- and a screen reader read "one"
                as body text rather than announcing a list of four. */}
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground marker:font-medium marker:text-foreground">
              <li>Download the PDF document(s) above.</li>
              <li>Complete every form, then sign and stamp it. Paginate all filled pages in order.</li>
              <li>
                Seal one original in a single envelope, marked with{" "}
                {tenderNumber ? <span className="font-medium text-foreground">{tenderNumber}</span> : "the quotation reference"}
                {" "}
                and your company&apos;s name and address.
              </li>
              <li>Deliver it by hand, courier or registered post to the tender box{address ? <>, {address}</> : null}.</li>
              {closing ? (
                <li>
                  It must arrive by <span className="font-medium text-foreground">{closing}</span>. Late quotations are
                  rejected.
                </li>
              ) : null}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              Quotations are not accepted through this website. They are opened in public immediately after the
              closing time.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
