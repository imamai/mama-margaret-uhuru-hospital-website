# Procurement document templates

Blank templates for the hospital's Request for Quotation pack, ready to upload to
**Admin → Document Library** and attach to any tender.

They were transcribed from the hospital's own RFQ (CHS/MMUH/RFQ/027/2026-2027) with
every filled-in value removed: no quotation number, no dates, no supplier details, no
signatures. Only the letterhead and the standing text remain.

## What to upload

| File | Library title to use |
|---|---|
| `00-rfq-full-pack.pdf` | Full RFQ pack |
| `01-form-of-quotation.pdf` | Form of Quotation |
| `02-price-schedule-form.pdf` | Price Schedule Form |
| `02b-quotation-submission-table-b.pdf` | Table B — Quotation Submission Table |
| `03-schedule-of-requirements-technical-specifications.pdf` | Schedule of Requirements and Technical Specifications |
| `04-form-for-disclosure-of-interest.pdf` | Form for Disclosure of Interest |
| `05-certificate-of-independent-quotation-determination.pdf` | Certificate of Independent Quotation Determination |
| `06-self-declaration-form.pdf` | Self-Declaration Form |
| `07-confidential-business-questionnaire.pdf` | Confidential Business Questionnaire (S33) |
| `08-form-sd1.pdf` | Form SD1 — not debarred under the Public Procurement and Asset Disposal Act |
| `09-form-sd2.pdf` | Form SD2 — no corrupt or fraudulent practice |
| `10-foreign-tenderer-40-percent-rule.pdf` | Foreign Tenderer 40% Rule (not applicable) |
| `11-contract-agreement-and-conditions.pdf` | Contract Agreement and Conditions of Contract |

Upload the full pack **and** the individual forms. The pack is what most tenders send
out in one file; the separate forms are there for a tender that needs only some of
them, or when one form is revised on its own.

`10-foreign-tenderer-40-percent-rule.pdf` is marked not applicable in the hospital's
own RFQ. It is included so it exists when a tender does need it — do not attach it
otherwise.

## Two things to check before the first tender goes out

1. **The letterhead email.** These carry `mamamargaretuhuruhosp2024@gmail.com`, the
   address published on the website. The RFQ that was shared used
   `mamamargaretuhuruhosp@gmail.com`. One of the two is wrong; correct the source and
   regenerate before issuing.
2. **Table B.** The hospital's RFQ refers to "Table B. Quotation Submission Table"
   three times — in the Form of Quotation and twice in the contract — but no Table B
   appears in the document. Suppliers are being asked to price an attachment that was
   never attached. `02b` supplies one; check it matches how the office wants prices
   broken down, and that the VAT rate is right for the category being bought.

## Regenerating

The PDFs are rendered from the HTML in `source/`. Edit the HTML, then re-render with a
headless browser — print to A4, 18/16/16/16mm margins, background graphics on, footer
`Page X of Y`. `source/rfq-template.html` is the whole pack; the numbered files are the
individual forms split out of it and each carries its own copy of the letterhead.

The letterhead logo is loaded from the live site, so re-rendering needs a network
connection.
