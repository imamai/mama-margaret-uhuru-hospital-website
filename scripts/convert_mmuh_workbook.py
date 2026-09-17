"""
One-time conversion of the hospital's first workbook into the canonical one.

    python scripts/convert_mmuh_workbook.py <their.xlsx> <canonical.xlsx>

The hospital filled in a bespoke template before this pipeline existed: title
banners above the headers, a "Keep on site?" column, three grouping rows that
look like departments but are not, and consultant departments that do not match
any department on its own list.

This applies the decisions taken on that workbook, once, so everything after it
reads the canonical format. Every judgement is named here rather than buried, so
it can be argued with:

  * The three all-capital rows with no description -- OUTPATIENT SERVICES,
    REHABILITATION UNIT, INPATIENT SERVICES -- are headings, not departments.
    Dropped; the 24 real departments are published flat.

  * Five departments left "Keep on site?" blank while every other row says YES.
    All five have full descriptions written for them, so they are published.

  * Names are corrected only where the workbook's own description gives the
    fuller name, or where the spelling is plainly wrong. Each correction is
    listed in RENAMES so the hospital can see exactly what changed.

  * Consultants are filed under the department matching their specialty, since
    the Doctors sheet names departments that exist nowhere else.
"""

import sys
from pathlib import Path

import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill

sys.path.insert(0, str(Path(__file__).parent))
from content_schema import slugify  # noqa: E402
from text_tidy import tidy  # noqa: E402


# Rows that group the departments beneath them rather than naming one.
HEADINGS = {"OUTPATIENT SERVICES", "REHABILITATION UNIT", "INPATIENT SERVICES"}

# Left of the arrow is exactly what the hospital wrote.
RENAMES = {
    "Laboratory services": "Laboratory Services",
    "Radiology services": "Radiology Services",
    "Opthamology": "Ophthalmology",
    "MCH/FP": "Mother, Child Health & Family Planning",
    "MEDICAL SOCIAL WORK": "Medical Social Work",
    "SGBV Center(Tumaini Clinic)": "SGBV Centre (Tumaini Clinic)",
    "Health information systems": "Health Information Systems",
    "Orthotrauma": "Orthopaedics & Trauma",
    "NBU Ward": "Newborn Unit (NBU)",
    "SUPPLY CHAIN MANAGEMENT": "Supply Chain Management",
    "BIOMEDICAL ENGINEERING": "Biomedical Engineering",
    "FAREWELL SERVICES": "Farewell Services",
}

# The Doctors sheet's department names appear on no other sheet, so each is
# matched to the department that carries the same specialty.
DOCTOR_DEPARTMENT = {
    "Reproductive Health": "Maternity",
    "Medicine": "Medical Ward",
    "Surgery": "Surgical Ward",
    "Paediatrics": "Paediatric Ward",
    "Orthopaedics": "Orthopaedics & Trauma",
    "Radiology": "Radiology Services",
}

SPECIALITY = {
    "OBS & GYN": "Obstetrics & Gynaecology",
    "Paeditrician": "Paediatrician",
}

CLINIC_NAMES = {
    "Medical Outpatient Clinic (MOPC)": ["MOPC"],
    "Surgical Outpatient Clinic (SOPC)": ["SOPC"],
    "Paediatric Outpatient Clinic (POPC)": ["POPC"],
    "Gynaecology Outpatient Clinic (GOPC)": ["GOPC"],
    "High Risk Clinic (HRC)": ["HRC"],
    "Orthopaedic Outpatient Clinic (OOPC)": ["OOPC"],
    "Chest Clinic": ["CHEST CLINIC"],
    "Dermatology Clinic": ["DERMATOLOGY"],
    "Eye Clinic": ["EYE CLINIC"],
}


def clinic_for(label: str) -> str:
    """The timetable abbreviates; the clinics sheet spells it out."""
    upper = str(label).strip().upper()
    for full, aliases in CLINIC_NAMES.items():
        if upper in aliases or upper == full.upper():
            return full
    return str(label).strip().title()


def split_specialist(raw: str):
    """'MUTUKU (Chest Specialist)' -> ('Mutuku', 'Chest Specialist')."""
    text = str(raw or "").strip()
    if not text:
        return "", ""
    role = ""
    if "(" in text and text.endswith(")"):
        name, role = text[: text.index("(")], text[text.index("(") + 1 : -1]
        text = name.strip()
        role = role.strip()
    # DR OBARE -> Dr Obare, MUTUKU -> Mutuku
    words = [w.capitalize() if not w.isdigit() else w for w in text.split()]
    if words and words[0].lower() in ("dr", "dr."):
        words[0] = "Dr"
    return " ".join(words), role


def rows_of(ws, first_data_row):
    for row in ws.iter_rows(min_row=first_data_row, values_only=True):
        if any(v not in (None, "") for v in row):
            yield row


def write_sheet(wb, title, headers, notes, rows):
    ws = wb.create_sheet(title)
    ws["A1"] = notes
    ws["A1"].font = Font(italic=True, size=9, color="5B6269")
    ws["A1"].alignment = Alignment(wrap_text=True, vertical="top")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=max(len(headers), 2))
    ws.row_dimensions[1].height = 30

    for i, head in enumerate(headers, start=1):
        cell = ws.cell(row=2, column=i, value=head)
        cell.font = Font(bold=True, size=10, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="0D5EA6")

    for r, record in enumerate(rows, start=3):
        for c, head in enumerate(headers, start=1):
            ws.cell(row=r, column=c, value=record.get(head, ""))

    widths = {"description": 70, "quote": 60, "name": 34, "full_name": 26,
              "setting_value": 60, "clinic_label": 34, "specialist_name": 22}
    for i, head in enumerate(headers, start=1):
        ws.column_dimensions[ws.cell(row=2, column=i).column_letter].width = widths.get(head, 18)
    ws.freeze_panes = "A3"
    return ws


def main(src_path, out_path):
    src = openpyxl.load_workbook(src_path, data_only=True)
    out = openpyxl.Workbook()
    out.remove(out.active)

    changed = []

    # ---------------------------------------------------------- departments --
    departments, dept_slug = [], {}
    for name, desc, keep in ((r[0], r[1], r[2]) for r in rows_of(src["Departments"], 5)):
        raw = str(name).strip()
        if raw.upper() in HEADINGS:
            continue
        final = RENAMES.get(raw, raw)
        if final != raw:
            changed.append(f"{raw}  ->  {final}")
        dept_slug[final] = slugify(final)
        departments.append({
            "name": final,
            "description": tidy(desc),
            "phone": "", "email": "", "location": "",
            "sort_order": len(departments) + 1,
            "status": "published",
        })

    write_sheet(out, "Departments",
                ["name", "description", "phone", "email", "location", "sort_order", "status"],
                "One row per department. Changing a name creates a new page rather than "
                "renaming the old one. status: published or draft.",
                departments)

    # -------------------------------------------------------------- clinics --
    clinics = [{"name": n, "description": "", "department_slug": "",
                "sort_order": i + 1, "status": "published"}
               for i, n in enumerate(CLINIC_NAMES)]
    write_sheet(out, "Clinics",
                ["name", "description", "department_slug", "sort_order", "status"],
                "Outpatient clinics. Descriptions were not supplied — a sentence each "
                "would help patients choose the right clinic.",
                clinics)

    # ------------------------------------------------------------- schedule --
    schedule, day = [], None
    for row in rows_of(src["Specialized Clinics"], 19):
        if row[0]:
            day = str(row[0]).strip().title()
        if not row[1]:
            continue
        who, role = split_specialist(row[3])
        schedule.append({
            "day_of_week": day,
            "clinic_label": clinic_for(row[1]),
            "start_time": str(row[2]).strip().upper().replace("AM", "").replace("PM", "").strip() or "08:00",
            "end_time": "",
            "specialist_name": who,
            "specialist_role": role,
            "room": "",
            "status": "published",
        })
    write_sheet(out, "Clinic Schedule",
                ["day_of_week", "clinic_label", "start_time", "end_time",
                 "specialist_name", "specialist_role", "room", "status"],
                "The weekly consultant timetable. specialist_name is free text — a "
                "consultant does not need a doctor profile to appear here.",
                schedule)

    # -------------------------------------------------------------- doctors --
    doctors = []
    for full, spec, dept, _photo in ((r[0], r[1], r[2], r[3]) for r in rows_of(src["Doctors"], 5)):
        name = str(full).strip().replace("Dr ", "Dr. ").replace("Dr.  ", "Dr. ")
        mapped = DOCTOR_DEPARTMENT.get(str(dept).strip(), "")
        doctors.append({
            "full_name": name,
            "title": "Dr.",
            "specialization": SPECIALITY.get(str(spec).strip(), str(spec).strip()),
            "department_slug": dept_slug.get(mapped, ""),
            "qualifications": "", "years_experience": "", "email": "", "phone": "",
            "sort_order": len(doctors) + 1,
            "status": "published",
        })
    write_sheet(out, "Doctors",
                ["full_name", "title", "specialization", "department_slug",
                 "qualifications", "years_experience", "email", "phone", "sort_order", "status"],
                "Photographs are uploaded in the admin, not here. department_slug must "
                "match a slug on the Departments sheet.",
                doctors)

    # --------------------------------------------------------- testimonials --
    testimonials = []
    for quote, who, perm in ((r[0], r[1], r[2]) for r in rows_of(src["Patient Testimonials"], 5)):
        if str(perm).strip().upper() != "YES":
            continue
        testimonials.append({
            "patient_name": str(who).strip(),
            "quote": tidy(str(quote).strip().strip('"')),
            "rating": 5,
            "sort_order": len(testimonials) + 1,
            "status": "published",
        })
    write_sheet(out, "Testimonials",
                ["patient_name", "quote", "rating", "sort_order", "status"],
                "Only quotes the patient has given permission to publish.",
                testimonials)

    # ------------------------------------------------------------- partners --
    TYPES = {"NGO Health Program": "ngo", "Academic": "academic"}
    partners = []
    for name, kind in ((r[0], r[1]) for r in rows_of(src["Our Partners"], 5)):
        partners.append({
            "name": str(name).strip().title() if str(name).isupper() else str(name).strip(),
            "partner_type": TYPES.get(str(kind).strip(), "general"),
            "website_url": "",
            "sort_order": len(partners) + 1,
            "status": "active",
        })
    write_sheet(out, "Partners",
                ["name", "partner_type", "website_url", "sort_order", "status"],
                "partner_type: general, academic, ngo, government or corporate.",
                partners)

    # ------------------------------------------------------------ insurance --
    insurance = [{"name": str(r[0]).strip(), "website_url": "",
                  "sort_order": i + 1, "status": "active"}
                 for i, r in enumerate(rows_of(src["Insurance Partners"], 5))]
    for row in insurance:
        if row["name"].isupper():
            row["name"] = row["name"].title().replace("Apa", "APA")
    write_sheet(out, "Insurance",
                ["name", "website_url", "sort_order", "status"],
                "Every insurance scheme accepted at the hospital.", insurance)

    # ---------------------------------------------------------------- stats --
    stats = [{"label": str(r[0]).strip(), "value": str(r[1]).strip(),
              "sort_order": i + 1, "status": "active"}
             for i, r in enumerate(rows_of(src["Hospital Stats"], 5))]
    for row in stats:
        if row["value"].isdigit() and len(row["value"]) > 3:
            row["value"] = f"{int(row['value']):,}"
    write_sheet(out, "Hospital Stats",
                ["label", "value", "sort_order", "status"],
                "The four headline numbers on the homepage. Write each figure exactly "
                "as it should appear.", stats)

    # ------------------------------------------------------- contact/about --
    contact = {str(r[0]).strip(): r[1] for r in rows_of(src["Contact & About"], 5)}
    settings = [
        ("hospital_name", "Mama Margaret Uhuru Hospital"),
        ("hospital_short_name", "MMUH"),
        ("emergency_phone", contact.get("Emergency Number", "")),
        ("ambulance_phone", "Coming soon"),
        ("general_phone", contact.get("General/Reception Phone", "")),
        ("email", contact.get("Email Address", "")),
        ("address", contact.get("Physical Address", "")),
        ("mission", contact.get("Mission Statement", "")),
        ("vision", contact.get("Vision Statement", "")),
    ]
    write_sheet(out, "Contact & About",
                ["setting_key", "setting_value"],
                "One row per detail. Do not rename the keys in the first column — the "
                "site looks them up by name. Only the second column is yours to change.",
                [{"setting_key": k, "setting_value": tidy(v)} for k, v in settings])

    out.save(out_path)
    print(f"wrote {out_path}")
    print(f"  departments {len(departments)}  clinics {len(clinics)}  schedule {len(schedule)}")
    print(f"  doctors {len(doctors)}  testimonials {len(testimonials)}  partners {len(partners)}")
    print("  names corrected:")
    for line in changed:
        print("   ", line)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        raise SystemExit(1)
    main(sys.argv[1], sys.argv[2])
