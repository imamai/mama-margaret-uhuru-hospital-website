"""
Mechanical tidying for text that goes onto public hospital pages.

The descriptions arrive as they were typed, straight into a page a patient
reads. Everything here is spacing and a short list of named corrections.

Nothing in this file rewrites a sentence or changes what a department says
about itself. That is the hospital's to write, and quietly "improving" it would
mean the website no longer says what they approved.
"""

import re

# Each of these is a defect rather than a preference, and each is listed in full
# rather than matched by pattern, so every substitution can be read and checked.
CORRECTIONS = [
    ("he Medical Social Work", "The Medical Social Work"),  # dropped first letter
    ("responsible fr the", "responsible for the"),
    ("24 hrs", "24 hours"),
    ("HIv ", "HIV "),
]


def tidy(text) -> str:
    """Spacing and typography only. Line breaks are preserved — the department
    pages render them, so the lists the hospital typed stay lists."""
    if text in (None, ""):
        return ""

    out = str(text).replace("\t", " ").replace("\r\n", "\n")

    for wrong, right in CORRECTIONS:
        out = out.replace(wrong, right)

    out = re.sub(r"\s+([,;:])", r"\1", out)             # " ,"     -> ","
    out = re.sub(r"([,;:])(?=[^\s\d])", r"\1 ", out)    # ",word"  -> ", word"
    out = re.sub(r"(?<=[a-z])\.(?=[A-Z])", ". ", out)   # "it.The" -> "it. The"
    out = re.sub(r"[ ]{2,}", " ", out)                  # runs of spaces
    out = re.sub(r"[ ]+\n", "\n", out)                  # trailing space per line
    out = re.sub(r"\n{3,}", "\n\n", out)                # no great gaps

    return out.strip()
