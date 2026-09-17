# Procurement document templates

Blank templates for the hospital's Request for Quotation pack, ready to upload to
**Admin → Document Library** and attach to any tender.

They were transcribed from the hospital's own RFQ (CHS/MMUH/RFQ/027/2026-2027) with
every filled-in value removed: no quotation number, no dates, no prices, no supplier
name, no signatures. Only the letterhead and the standing text remain.

**They fit any tender and any firm.** Nothing in them is about the website contract
they were transcribed from, and nothing names the firm that submitted it. Each form
keeps the "goods / works / services (select one)" wording of the standard, so the same
pack goes out for a supply tender, a works tender or a service tender. What changes per
tender is filled in on issue: quotation number, description, closing date and time,
validity period, and the item lines in the Schedule of Requirements. Everything a
bidder writes — company name, prices, declarations, signatures and stamp — is blank.

The priced schedules carry twelve item lines. Add rows for a larger requirement; the
tables are plain HTML in `source/`.

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

`source/rfq-template.html` is the single source for all thirteen PDFs — the full pack
and every individual form are cut from it, so a wording change is made once.

```
cd source && node build.mjs
```

Needs Playwright with Microsoft Edge, and a network connection (the letterhead logo is
loaded from the live site). Splitting the forms by hand is how one of them ends up
saying something different on its own than it does inside the pack.
