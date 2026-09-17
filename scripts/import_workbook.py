"""
Push a filled content workbook straight into the live site.

    SUPABASE_SERVICE_ROLE_KEY=... python scripts/import_workbook.py <workbook.xlsx> [--dry-run]

This is the repeat-update tool. The team edits the canonical workbook, and this
writes it to the database through the Supabase API — no SQL to paste, no
dashboard. It follows exactly the same rules as build_migration.py, so the
generated migration and a live import always agree:

  * A row is matched on the key named in content_schema.TABLES. If it exists it
    is updated, otherwise it is created.
  * A blank cell leaves the existing value alone. Clearing a field is something
    to do deliberately in the admin, not by leaving a spreadsheet cell empty.
  * Nothing is ever deleted. A row missing from the workbook is left as it is.

--dry-run reports what would change without writing anything.

The service-role key bypasses row-level security, so it is read from the
environment and never written to disk or printed.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import openpyxl

sys.path.insert(0, str(Path(__file__).parent))
from build_migration import read_sheet  # noqa: E402
from content_schema import TABLES, day_number, slugify  # noqa: E402

PROJECT_URL = "https://sedsjjmjnikppfaecaya.supabase.co"

LOOKUPS = {
    "department_slug": ("department_id", "margaret_departments", "slug"),
    "clinic_slug": ("clinic_id", "margaret_clinics", "slug"),
}
NUMERIC = {"sort_order", "day_of_week", "rating", "awarded_year", "years_experience"}
JSON_VALUE = {"setting_value"}


class Api:
    def __init__(self, key: str):
        self.key = key

    def _call(self, method, path, body=None):
        req = urllib.request.Request(
            f"{PROJECT_URL}/rest/v1/{path}",
            method=method,
            data=None if body is None else json.dumps(body).encode("utf-8"),
            headers={
                "apikey": self.key,
                "Authorization": f"Bearer {self.key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        )
        try:
            with urllib.request.urlopen(req) as res:
                raw = res.read().decode("utf-8")
                return json.loads(raw) if raw else []
        except urllib.error.HTTPError as err:
            detail = err.read().decode("utf-8", "replace")
            raise RuntimeError(f"{method} {path.split('?')[0]} -> {err.code}: {detail}") from None

    def get(self, path):
        return self._call("GET", path)

    def post(self, table, body):
        return self._call("POST", table, body)

    def patch(self, path, body):
        return self._call("PATCH", path, body)


def eq(value) -> str:
    return "eq." + urllib.parse.quote(str(value), safe="")


def clean(column, value):
    """The value as the API should receive it, or None for 'leave alone'."""
    if value is None or (isinstance(value, str) and value.strip() == ""):
        return None
    if column == "day_of_week":
        return day_number(value)
    if column in ("start_time", "end_time"):
        return str(value).strip()[:8]
    if column in NUMERIC:
        return int(float(value))
    if column in JSON_VALUE:
        return str(value).strip()          # stored as a JSON string
    return str(value).strip() if isinstance(value, str) else value


def resolve(api, cache, column, value):
    target, table, match = LOOKUPS[column]
    if value is None:
        return target, None
    k = (table, value)
    if k not in cache:
        rows = api.get(f"{table}?select=id&{match}={eq(value)}&limit=1")
        cache[k] = rows[0]["id"] if rows else None
    if cache[k] is None:
        raise RuntimeError(f"{column} {value!r} does not match any row in {table}")
    return target, cache[k]


def main(path, dry_run):
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip().strip('"')
    if not key:
        raise SystemExit("Set SUPABASE_SERVICE_ROLE_KEY in the environment first.")

    api = Api(key)
    wb = openpyxl.load_workbook(path, data_only=True)
    cache = {}
    totals = {"created": 0, "updated": 0}

    for spec in TABLES:
        rows = read_sheet(wb, spec["sheet"])
        if not rows:
            continue

        table = spec["table"]
        keys = (spec["key"],) if isinstance(spec["key"], str) else spec["key"]
        created = updated = 0

        for record in rows:
            for derived, source in (spec.get("derive") or {}).items():
                if not record.get(derived) and record.get(source):
                    record[derived] = slugify(str(record[source]))

            columns = list(spec["columns"])
            for derived in (spec.get("derive") or {}):
                if derived not in columns:
                    columns.append(derived)

            body = {}
            for column in columns:
                value = clean(column, record.get(column))
                if column in LOOKUPS:
                    try:
                        column, value = resolve(api, cache, column, value)
                    except RuntimeError:
                        # In a dry run the departments this points at have not
                        # been created yet, so the link cannot be checked.
                        if not dry_run:
                            raise
                        column, value = LOOKUPS[column][0], None
                if value is not None:
                    body[column] = value

            missing = [k for k in keys if body.get(k) is None]
            if missing:
                print(f"  skipped a {spec['sheet']} row with no {', '.join(missing)}")
                continue

            where = "&".join(f"{k}={eq(body[k])}" for k in keys)
            exists = api.get(f"{table}?select=id&{where}&limit=1")

            if exists:
                updated += 1
                if not dry_run:
                    api.patch(f"{table}?{where}", {k: v for k, v in body.items() if k not in keys})
            else:
                created += 1
                if not dry_run:
                    api.post(table, body)

        totals["created"] += created
        totals["updated"] += updated
        print(f"{spec['sheet']:<18} {created:>3} created  {updated:>3} updated")

    verb = "would be" if dry_run else "were"
    print(f"\n{totals['created']} rows {verb} created, {totals['updated']} {verb} updated.")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        print(__doc__)
        raise SystemExit(1)
    main(args[0], "--dry-run" in sys.argv)
