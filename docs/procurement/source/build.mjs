/**
 * Rebuilds every procurement PDF from rfq-template.html.
 *
 * That one file is the source: edit the wording there, run this, and the full
 * pack and each individual form are regenerated together. Splitting by hand
 * is how a form ends up saying one thing in the pack and another on its own.
 *
 *   node build.mjs
 *
 * Needs Playwright and Microsoft Edge, and a network connection — the
 * letterhead logo is loaded from the live site. If playwright is not resolvable
 * from this folder, run it from a project that has it installed, e.g.
 *   node --input-type=module -e "await import('<path>/build.mjs')"
 * from that project's directory.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(here, "..")

/** Section marker -> output file and title. The order is the pack's order. */
const FORMS = [
  ["FORM OF QUOTATION", "01-form-of-quotation", "Form of Quotation"],
  ["SCHEDULE OF REQUIREMENTS", "02-price-schedule-form", "Price Schedule Form"],
  ["TABLE B", "02b-quotation-submission-table-b", "Table B - Quotation Submission Table"],
  ["PART 2", "03-schedule-of-requirements-technical-specifications", "Schedule of Requirements and Technical Specifications"],
  ["DISCLOSURE OF INTEREST", "04-form-for-disclosure-of-interest", "Form for Disclosure of Interest"],
  ["INDEPENDENT QUOTATION", "05-certificate-of-independent-quotation-determination", "Certificate of Independent Quotation Determination"],
  ["SELF-DECLARATION", "06-self-declaration-form", "Self-Declaration Form"],
  ["CBQ", "07-confidential-business-questionnaire", "Confidential Business Questionnaire (S33)"],
  ["SD1", "08-form-sd1", "Form SD1 - not debarred"],
  ["SD2", "09-form-sd2", "Form SD2 - no corrupt or fraudulent practice"],
  ["40% RULE", "10-foreign-tenderer-40-percent-rule", "Foreign Tenderer 40 percent Rule (not applicable)"],
  ["PART 3", "11-contract-agreement-and-conditions", "Contract Agreement and Conditions of Contract"],
]

const src = fs.readFileSync(path.join(here, "rfq-template.html"), "utf8")
const head = src.split("<body>")[0] + "<body>\n"
const body = src.split("<body>")[1].split("</body>")[0]

const chunks = body.split(/<!-- =+ ([A-Z0-9 %&-]+) =+ -->/)
const sections = {}
for (let i = 1; i < chunks.length; i += 2) sections[chunks[i].trim()] = chunks[i + 1]

const letterhead = sections.COVER.match(/<div class="letterhead">[\s\S]*?<\/div>\s*<\/div>/)[0]

const pages = [["00-rfq-full-pack", "Request for Quotation", src]]

for (const [marker, slug, title] of FORMS) {
  if (!sections[marker]) throw new Error(`Section not found in template: ${marker}`)
  // Each form starts on its own page 1, so its leading page break goes.
  const content = sections[marker].replace(/^\s*<div class="page-break"><\/div>/, "")
  const html =
    head.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`) +
    letterhead +
    "\n" +
    content +
    "\n</body></html>"
  pages.push([slug, title, html])
}

const browser = await chromium.launch({ channel: "msedge" })
const page = await browser.newPage()

for (const [slug, , html] of pages) {
  const tmp = path.join(here, `${slug}.html`)
  fs.writeFileSync(tmp, html, "utf8")
  await page.goto("file:///" + tmp.split(path.sep).join("/"), { waitUntil: "networkidle" })
  const pdf = path.join(outDir, `${slug}.pdf`)
  await page.pdf({
    path: pdf,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate:
      '<div style="width:100%;font-size:8pt;font-family:Georgia,serif;text-align:center;color:#444;padding:0 16mm;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin: { top: "18mm", right: "16mm", bottom: "16mm", left: "16mm" },
  })
  console.log(`${slug}.pdf  ${Math.round(fs.statSync(pdf).size / 1024)} KB`)
}

await browser.close()
