"""
The single description of how a workbook sheet corresponds to a database table.

There is deliberately no mapping layer anywhere else. A sheet is named after its
table and each column is named after its column, so filling a cell is editing a
row and nothing has to be translated in between. Two tools read this file:

  build_migration.py   turns a filled workbook into SQL
  build_template.py    turns this file into an empty workbook for the team

Keeping both on one definition is the point: a column added here appears in the
next template and is accepted by the next import, with no third place to update
and no chance of the two drifting apart.
"""

# Every content table follows the same conventions, so the tools never special-case:
#   key      the column that identifies a row across imports (an upsert key)
#   columns  what the team fills in, in the order the sheet presents them
#   notes    shown under the header in the template, in plain language
#   derive   columns the tools compute rather than ask for (slug from name)

TABLES = [
    {
        "table": "margaret_departments",
        "sheet": "Departments",
        "title": "Departments",
        "key": "slug",
        "derive": {"slug": "name"},
        "columns": ["name", "description", "phone", "email", "location", "sort_order", "status"],
        "notes": (
            "One row per department. The name becomes the page address, so changing a "
            "name creates a new page rather than renaming the old one. "
            "status: published or draft."
        ),
    },
    {
        "table": "margaret_clinics",
        "sheet": "Clinics",
        "title": "Specialised clinics",
        "key": "slug",
        "derive": {"slug": "name"},
        "columns": ["name", "description", "department_slug", "sort_order", "status"],
        "notes": (
            "Outpatient clinics. department_slug links a clinic to a department — use "
            "the slug shown on the Departments sheet, or leave blank."
        ),
    },
    {
        "table": "margaret_clinic_schedule",
        "sheet": "Clinic Schedule",
        "title": "Consultant clinic timetable",
        "key": ("clinic_label", "day_of_week", "start_time"),
        "columns": [
            "day_of_week", "clinic_label", "start_time", "end_time",
            "specialist_name", "specialist_role", "room", "status",
        ],
        "notes": (
            "The weekly consultant timetable shown on the Clinics page. "
            "day_of_week: Monday to Sunday. start_time: 08:00. "
            "specialist_name is free text — a consultant does not need a doctor profile "
            "to appear here."
        ),
    },
    {
        "table": "margaret_doctors",
        "sheet": "Doctors",
        "title": "Doctors",
        "key": "slug",
        "derive": {"slug": "full_name"},
        "columns": [
            "full_name", "title", "specialization", "department_slug",
            "years_experience", "email", "phone", "sort_order", "status",
        ],
        "notes": (
            "Photographs are uploaded in the admin, not here — a filename in this sheet "
            "does nothing. department_slug must match a slug on the Departments sheet."
        ),
    },
    {
        "table": "margaret_testimonials",
        "sheet": "Testimonials",
        "title": "Patient testimonials",
        "key": "patient_name",
        "columns": ["patient_name", "quote", "rating", "sort_order", "status"],
        "notes": "Only include quotes the patient has given permission to publish.",
    },
    {
        "table": "margaret_partners",
        "sheet": "Partners",
        "title": "Partners",
        "key": "name",
        "columns": ["name", "partner_type", "website_url", "sort_order", "status"],
        "notes": "partner_type: general, academic, ngo, government or corporate.",
    },
    {
        "table": "margaret_insurance_partners",
        "sheet": "Insurance",
        "title": "Insurance partners",
        "key": "name",
        "columns": ["name", "website_url", "sort_order", "status"],
        "notes": "Every insurance scheme accepted at the hospital.",
    },
    {
        "table": "margaret_awards",
        "sheet": "Awards",
        "title": "Awards and accreditations",
        "key": "title",
        "columns": ["title", "awarding_body", "awarded_year", "description", "sort_order", "status"],
        "notes": "Leave the sheet empty if there are none — the section hides itself.",
    },
    {
        "table": "margaret_stats",
        "sheet": "Hospital Stats",
        "title": "Homepage figures",
        "key": "label",
        "columns": ["label", "value", "sort_order", "status"],
        "notes": (
            "The four headline numbers on the homepage. Write the figure exactly as it "
            "should appear, including any comma or plus sign."
        ),
    },
    {
        "table": "margaret_settings",
        "sheet": "Contact & About",
        "title": "Contact details and about",
        "key": "setting_key",
        "columns": ["setting_key", "setting_value"],
        "notes": (
            "One row per detail. Do not rename the keys in the first column — the site "
            "looks them up by name. Only the second column is yours to change."
        ),
        "fixed_rows": [
            "hospital_name", "hospital_short_name", "emergency_phone", "ambulance_phone",
            "general_phone", "email", "address", "mission", "vision",
        ],
    },
]

# Columns the team never fills: the database sets them, or the admin screens do.
MANAGED_ELSEWHERE = {
    "id", "created_at", "updated_at", "created_by", "updated_by", "deleted_at",
    "banner_image_url", "photo_url", "logo_url", "featured_image_url", "thumbnail_url",
    "slug", "seo_title", "seo_description",
}


def slugify(value: str) -> str:
    """Matches the site's own slugs: lowercase, words joined by hyphens."""
    out, prev_dash = [], False
    for ch in value.strip().lower():
        if ch.isalnum():
            out.append(ch)
            prev_dash = False
        elif not prev_dash and out:
            out.append("-")
            prev_dash = True
    return "".join(out).strip("-")


DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def day_number(value) -> int:
    """Monday is 1. Accepts a name, an abbreviation, or a number already."""
    if isinstance(value, int):
        return value
    text = str(value).strip().lower()
    if text.isdigit():
        return int(text)
    for i, day in enumerate(DAYS, start=1):
        if day.lower().startswith(text[:3]):
            return i
    raise ValueError(f"not a day of the week: {value!r}")


def sql_str(value) -> str:
    """A SQL literal, or NULL. Doubling the quote is the whole escape rule."""
    if value is None:
        return "null"
    text = str(value).strip()
    if text == "":
        return "null"
    return "'" + text.replace("'", "''") + "'"
