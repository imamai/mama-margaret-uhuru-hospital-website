# SEO: how it works, and what only you can do

This describes what the site does automatically, and the handful of steps that
have to be done by a person with access to Google and to the hospital's own
records. Nothing here can make a page rank — Google decides that. What it can do
is make sure nothing on our side stops a page being found.

---

## 1. What the site does on its own

**Every public page** gets a title, a description, a canonical URL, an Open
Graph card and a Twitter card, built in `lib/seo.ts` by `pageMetadata()`.

Pages in the CMS (departments, clinics, news, the About and Patient pages) use
the **SEO title** and **SEO description** you type into the admin. Leave them
blank and the page builds a sensible one from its own content — so a page is
never broken for want of an SEO field, it just uses wording you did not choose.

**Structured data** (JSON-LD) is emitted on every public page:

| Schema | Where | Built from |
|---|---|---|
| `Hospital` | every page | Settings: name, address, phones, email, map link |
| `WebSite` | every page | Settings |
| `MedicalClinic` | each department and clinic page | that department/clinic |
| `Physician` | each doctor page | that doctor's profile |
| `Article` | each news article | that article |
| `BreadcrumbList` | every page with breadcrumbs | the trail shown on screen |

**`/sitemap.xml`** is generated from the database. Publish a department, a
doctor or an article and it appears there automatically — no code change, no
redeploy. Unpublished and deleted items can never appear: the sitemap uses the
same queries the public pages use, which filter on `status = 'published'`.

**`/robots.txt`** allows everything public and blocks `/admin`, `/api`,
`/suppliers/login` and `/suppliers/dashboard`. Those routes also carry their own
`noindex`, because `Disallow` only stops crawling — a URL linked from somewhere
else can still be indexed without ever being fetched.

---

## 2. The one setting that must be right

`NEXT_PUBLIC_SITE_URL` must be set in production to:

```
https://mamamargaretuhuruhospital.co.ke
```

with **no trailing slash**. It is the origin used for every canonical tag, every
Open Graph URL, `robots.txt` and `sitemap.xml`.

If it is missing, the code falls back to that same domain rather than to
`localhost`, so a forgotten variable is no longer a disaster. Set it anyway —
preview deployments should point at themselves.

> **Spelling, confirmed by DNS.** The live domain is spelled `marg**a**ret`,
> matching the hospital's email. `mamamarg**e**retuhuruhospital.co.ke` does not
> resolve at all. Only the "argaret" spelling is correct; a canonical tag
> pointing at a domain that does not exist is worse than no canonical at all.
>
> There is currently **no `www` record** — `www.mamamargaretuhuruhospital.co.ke`
> does not answer. That is fine (the site is reachable without it), but see
> §3 for why it changes which Search Console property type to use.

---

## 3. Google Search Console — one-time setup

1. Go to <https://search.google.com/search-console> and sign in with the account
   the hospital will keep long term, not a personal one.
2. **Add property → Domain** and enter `mamamargaretuhuruhospital.co.ke`.
   A Domain property covers `www`, non-`www`, `http` and `https` in one go.
3. Google gives you a **TXT record**. Add it in the DNS panel where the domain
   is registered, then press Verify. DNS can take up to an hour.
   *If you cannot reach DNS*, use the **URL prefix** method with the HTML tag
   instead, and paste the tag's content into `app/layout.tsx` under
   `verification.google`.
4. **Sitemaps → Add a new sitemap →** type `sitemap.xml` → Submit.
5. **URL Inspection**: paste the homepage URL, then **Request indexing**. Do the
   same for `/departments`, `/contact` and `/appointments`. Do not do this for
   every page — it is rate-limited and the sitemap covers the rest.

Indexing takes days to weeks. Submitting a sitemap asks Google to look; it does
not oblige Google to index, and it does not affect ranking.

### What to watch afterwards

- **Pages** — how many are indexed, and the reason given for any that are not.
- **Performance** — the searches people actually used to reach the site,
  impressions, clicks, average position. This is where you find out whether
  patients search "hospital Outering Road" or "MMUH" or something else entirely.
  Feed what you learn back into department SEO titles.
- **Core Web Vitals** and **Mobile usability** — real measurements from real
  visitors' phones, which matter more than any local test.
- **Enhancements** — Google reports the structured data it parsed. Errors here
  are worth fixing promptly.

---

## 4. Google Business Profile — the highest-value step

For a hospital this matters **more than everything above**. Most patients search
"hospital near me" and never scroll past the map.

1. Go to <https://business.google.com> and claim
   **Mama Margaret Uhuru Hospital**. A listing already exists (our map link
   resolves to place ID `0x182f15dfea8dff3d:0xa351343c9d0b3bfd`), so claim it
   rather than creating a duplicate.
2. Verification is normally by postcard to the physical address, sometimes by
   phone or video.
3. Make these match the website **exactly** — inconsistent details are the most
   common reason a local listing underperforms:

   | Field | Value |
   |---|---|
   | Name | Mama Margaret Uhuru Hospital |
   | Address | Outering Road, Off Kamunde Road, Nairobi |
   | Phone | 0794-414-425 |
   | Website | https://mamamargaretuhuruhospital.co.ke |

4. Add **opening hours**, including whether Accident & Emergency is genuinely
   24 hours (see §6 — the site does not currently claim hours anywhere).
5. Add real photos of the hospital. Never a photo containing an identifiable
   patient without written consent.
6. Ask satisfied patients to leave a review, and reply to the ones you get.
   **Never** write, buy or incentivise reviews — Google removes them and it can
   cost the listing.

---

## 5. Publishing well (for whoever edits the site)

When you add a department, clinic or article:

- **SEO title** — say what it is and, where it reads naturally, where it is.
  "Maternity & Antenatal Care in Nairobi" beats "Maternity". Keep it under
  about 60 characters.
- **SEO description** — 70–160 characters, describing what is genuinely on the
  page, ending with what the reader should do next.
- **Image** — every department and article should have one. It becomes the
  WhatsApp and Facebook preview; without it, a shared link is a grey box.
- **Check it** in **Admin → Site → SEO Readiness**, which lists every published
  page missing a title or description, flags duplicates, and previews the
  homepage as Google would show it.

Two rules that matter more here than on an ordinary website:

- **Never publish a medical claim nobody has checked.** Health content is held
  to a higher standard by Google and by patients. If a page describes what a
  treatment does, a clinician should read it first.
- **Never name a service, a doctor or an accreditation that is not real.** It
  misleads a patient making a decision about their health, and it is the fastest
  way to lose search visibility permanently.

---

## 6. Deliberately left out, pending your confirmation

These are absent because inventing them would be worse than omitting them. Each
is a one-line addition to `hospitalJsonLd()` in `lib/seo.ts` once you confirm:

- **Opening hours.** The Accident & Emergency page says it "operates 24 hours a
  day", but nothing states the hours of the hospital as a whole or of individual
  clinics. Confirm them and they can be published as `openingHoursSpecification`
  — which is what fills in "Open now / Closes 5 pm" in Google's results.
- **Insurance and NHIF/SHA acceptance.** Patients search this constantly. The
  site has an insurance-partners section; once you confirm the list is current,
  it can be stated in schema too.
- **Accreditation and licensing** (e.g. KMPDC facility registration). Only
  publish what the hospital genuinely holds and can evidence.
- **Bed capacity**, **founding date**, **number of staff**.
- **Social profiles.** All five fields in Settings are currently blank, so no
  `sameAs` is emitted. Fill in the real Facebook and X/Twitter pages and they
  will be linked to the hospital's entity automatically.
- **Ambulance number.** Settings currently reads "Coming soon", which the code
  correctly refuses to publish as a phone number. Replace it with the real line
  when there is one.

---

## 7. Worth doing next

- **Patient-facing FAQ content.** "Do you accept NHIF?", "What are visiting
  hours?", "Do I need a referral?" are real, high-volume searches. Answer them
  on the relevant pages and they become eligible for FAQ rich results —
  `faqJsonLd()` is already written and waiting for content.
- **Fill in department SEO fields.** All 24 published departments currently fall
  back to a generated title. They work, but the wording is not yours.
- **Health-tips articles** tied to real departments (antenatal care →
  Maternity; immunisation schedules → MCH). This is how a hospital site builds
  authority on the topics it genuinely practises.
- **Legitimate links**: the Ministry of Health and Nairobi County facility
  directories, professional associations, partner and referral facilities, and
  local news coverage of genuine hospital activity. Never buy links.
