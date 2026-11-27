#!/usr/bin/env python3
"""Build LotteryLab's normalized Lotto Max main-draw and MAXMILLIONS datasets."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_URL = (
    "https://www.wclc.com/web/file?contentid=18171&owner="
    "c9f32ff5-1abe-4fe9-b345-bdda4039a0eb&uuid="
    "70e1d7b1-ca54-4011-80fc-7c772106f70a"
)
SUPPLEMENT_PATH = ROOT / "data/lotto-max/supplemental-2026-11.json"
OUTPUT_DIR = ROOT / "public/data/lotto-max"
MONTHS = "January February March April May June July August September October November December".split()
DATE_RE = re.compile(
    r"^\s*(" + "|".join(MONTHS) + r")\s+(\d{1,2}),?\s+(20\d{2})\s+(.*)$"
)
DRAW_LABEL_RE = re.compile(r"Draw\s*#\s*(\d+)", re.I)

# The WCLC PDF text layer has a small number of malformed rows. These values
# are corrected only for the named dates and carry an explicit audit note.
CORRECTIONS = {
    "2022-01-25": {
        "mainNumbers": [11, 13, 18, 20, 23, 30, 40],
        "bonusNumber": 37,
        "note": "PDF text joined bonus 37 to the first EXTRA digit; cross-checked against the date-specific LottoMaxNumbers.com result.",
        "crossCheck": "https://www.lottomaxnumbers.com/numbers/lotto-max-result-01-25-2022",
    },
    "2024-11-26": {
        "mainNumbers": [20, 24, 31, 33, 36, 41, 49],
        "bonusNumber": 50,
        "note": "PDF text layer omitted main number 33 and bonus 50; cross-checked against the date-specific LottoMaxNumbers.com result.",
        "crossCheck": "https://www.lottomaxnumbers.com/numbers/lotto-max-result-11-26-2024",
    },
    "2026-03-03": {
        "mainNumbers": [1, 3, 4, 18, 20, 23, 31],
        "bonusNumber": 2,
        "note": "WCLC archive text shows 61, outside the 1–50 pool in force on this date. Corrected to 31 with bonus 2 using the date-specific LottoMaxNumbers.com result and corroborating published results.",
        "crossCheck": "https://www.lottomaxnumbers.com/numbers/lotto-max-result-03-03-2026",
    },
    "2026-10-09": {
        "mainNumbers": [6, 10, 19, 25, 29, 39, 50],
        "bonusNumber": 36,
        "note": "PDF text layer joined final main number 50 and bonus 36; cross-checked against the 2026 results archive.",
        "crossCheck": "https://www.lottomaxnumbers.com/numbers/2026",
    },
    "2026-10-13": {
        "mainNumbers": [7, 11, 19, 28, 32, 35, 50],
        "bonusNumber": 36,
        "note": "PDF text layer joined final main number 50 and bonus 36; cross-checked against the 2026 results archive.",
        "crossCheck": "https://www.lottomaxnumbers.com/numbers/2026",
    },
    "2026-10-16": {
        "mainNumbers": [1, 11, 13, 36, 41, 43, 51],
        "bonusNumber": 52,
        "note": "PDF text layer joined final main number 51 and bonus 52; cross-checked against the 2026 results archive.",
        "crossCheck": "https://www.lottomaxnumbers.com/numbers/2026",
    },
}


def rule_era(draw_date: dt.date) -> tuple[str, int]:
    if draw_date < dt.date(2019, 5, 17):
        return "7/49", 49
    if draw_date < dt.date(2026, 4, 14):
        return "7/50", 50
    return "7/52", 52


def parse_archive(text: str) -> tuple[list[dict], list[dict], list[dict]]:
    main_records: list[dict] = []
    maxmillions: list[dict] = []
    exceptions: list[dict] = []
    current_date: dt.date | None = None
    in_maxmillions = False

    for line_number, line in enumerate(text.splitlines(), start=1):
        date_match = DATE_RE.match(line)
        if date_match:
            current_date = dt.date(
                int(date_match.group(3)),
                MONTHS.index(date_match.group(1)) + 1,
                int(date_match.group(2)),
            )
            in_maxmillions = False
            date_key = current_date.isoformat()
            number_tokens = [int(x) for x in re.findall(r"\d+", date_match.group(4))]

            if date_key in CORRECTIONS:
                correction = CORRECTIONS[date_key]
                main_numbers = correction["mainNumbers"]
                bonus = correction["bonusNumber"]
                validation = "corrected-after-cross-check"
                extra = {
                    "validationNote": correction["note"],
                    "crossCheckSource": correction["crossCheck"],
                }
            else:
                if len(number_tokens) < 8:
                    raise ValueError(
                        f"Unresolved main-draw row at extracted line {line_number}: {line!r}"
                    )
                main_numbers = number_tokens[:7]
                bonus = number_tokens[7]
                validation = "parsed-from-wclc-archive"
                extra = {}

            era, pool = rule_era(current_date)
            if (
                len(main_numbers) != 7
                or len(set(main_numbers)) != 7
                or any(n < 1 or n > pool for n in main_numbers)
                or bonus < 1
                or bonus > pool
                or bonus in main_numbers
            ):
                raise ValueError(
                    f"Invalid draw {date_key}: main={main_numbers}, bonus={bonus}, pool={pool}"
                )

            main_records.append(
                {
                    "drawDate": date_key,
                    "mainNumbers": main_numbers,
                    "bonusNumber": bonus,
                    "ruleEra": era,
                    "validation": validation,
                    "source": "WCLC since-inception archive",
                    **extra,
                }
            )
            continue

        if re.search(r"Max\s*Millions|Maxmillions", line, re.I):
            in_maxmillions = True

        label = DRAW_LABEL_RE.search(line)
        if in_maxmillions and label and current_date:
            values = [int(x) for x in re.findall(r"\d+", line[label.end() :])]
            series_number = int(label.group(1))
            era, pool = rule_era(current_date)
            if (
                len(values) == 7
                and len(set(values)) == 7
                and all(1 <= n <= pool for n in values)
            ):
                maxmillions.append(
                    {
                        "drawDate": current_date.isoformat(),
                        "seriesNumber": series_number,
                        "prizeAmount": 1_000_000,
                        "winningNumbers": values,
                        "ruleEra": era,
                        "validation": "parsed-from-wclc-archive",
                        "source": "WCLC since-inception archive",
                    }
                )
            else:
                exceptions.append(
                    {
                        "drawDate": current_date.isoformat(),
                        "seriesNumber": series_number,
                        "extractedLine": line_number,
                        "rawText": line.strip(),
                        "reason": "Incomplete or invalid MAXMILLIONS row; not imported.",
                    }
                )

    if not main_records:
        raise ValueError("No dated main-draw records were found in the WCLC archive.")
    return main_records, maxmillions, exceptions


def load_archive_text(local_archive: Path | None) -> str:
    if local_archive:
        archive_bytes = local_archive.read_bytes()
    else:
        request = urllib.request.Request(
            ARCHIVE_URL, headers={"User-Agent": "LotteryLab-data-builder/1.0"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            archive_bytes = response.read()

    if not archive_bytes.startswith(b"%PDF"):
        raise ValueError(
            "The WCLC archive URL did not return a PDF. Stop rather than parse an unexpected format."
        )

    with tempfile.TemporaryDirectory() as temp_dir:
        pdf_path = Path(temp_dir) / "wclc-lotto-max.pdf"
        text_path = Path(temp_dir) / "wclc-lotto-max.txt"
        pdf_path.write_bytes(archive_bytes)
        subprocess.run(
            ["pdftotext", "-layout", str(pdf_path), str(text_path)], check=True
        )
        return text_path.read_text(encoding="utf-8", errors="replace")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--archive-path",
        type=Path,
        help="Use a local WCLC PDF instead of downloading the official archive.",
    )
    args = parser.parse_args()

    archive_text = load_archive_text(args.archive_path)
    draws, maxmillions, exceptions = parse_archive(archive_text)
    by_date = {record["drawDate"]: record for record in draws}
    if len(by_date) != len(draws):
        raise ValueError("Duplicate draw dates detected in the WCLC archive.")

    supplemental = json.loads(SUPPLEMENT_PATH.read_text(encoding="utf-8"))
    for item in supplemental["records"]:
        date_key = item["drawDate"]
        incoming = {
            "drawDate": date_key,
            "mainNumbers": item["mainNumbers"],
            "bonusNumber": item["bonusNumber"],
        }
        if date_key in by_date:
            existing = by_date[date_key]
            if (
                existing["mainNumbers"] != incoming["mainNumbers"]
                or existing["bonusNumber"] != incoming["bonusNumber"]
            ):
                raise ValueError(
                    f"WCLC/supplement disagreement for {date_key}; refusing to merge."
                )
            continue

        draw_date = dt.date.fromisoformat(date_key)
        era, pool = rule_era(draw_date)
        if (
            len(incoming["mainNumbers"]) != 7
            or len(set(incoming["mainNumbers"])) != 7
            or any(n < 1 or n > pool for n in incoming["mainNumbers"])
        ):
            raise ValueError(f"Invalid supplemental main numbers for {date_key}.")
        if (
            incoming["bonusNumber"] < 1
            or incoming["bonusNumber"] > pool
            or incoming["bonusNumber"] in incoming["mainNumbers"]
        ):
            raise ValueError(f"Invalid supplemental bonus for {date_key}.")

        by_date[date_key] = {
            **incoming,
            "ruleEra": era,
            "validation": "cross-checked-wclc-and-secondary-source",
            "source": "WCLC recent results + LottoMaxNumbers.com",
        }

    all_draws = [by_date[key] for key in sorted(by_date)]
    if len(all_draws) != len({x["drawDate"] for x in all_draws}):
        raise ValueError("Duplicate dates detected after supplement merge.")

    draws_payload = {
        "game": "Lotto Max",
        "datasetVersion": 1,
        "coverage": {
            "from": all_draws[0]["drawDate"],
            "through": all_draws[-1]["drawDate"],
        },
        "recordCount": len(all_draws),
        "sources": [
            {
                "role": "primary",
                "name": "WCLC",
                "url": "https://www.wclc.com/display-on/display-on-downloads/lotto-max-since-inception.htm",
            },
            {
                "role": "secondary",
                "name": "LottoMaxNumbers.com",
                "url": "https://www.lottomaxnumbers.com/",
            },
        ],
        "ruleEras": [
            {"from": "2009-09-25", "through": "2019-05-14", "format": "7/49"},
            {"from": "2019-05-17", "through": "2026-04-10", "format": "7/50"},
            {"from": "2026-04-14", "through": None, "format": "7/52"},
        ],
        "excluded": [
            "EXTRA (machine-generated add-on; intentionally out of scope)"
        ],
        "records": all_draws,
    }

    mm_payload = {
        "game": "Lotto Max",
        "drawType": "MAXMILLIONS",
        "prizeAmount": 1_000_000,
        "currency": "CAD",
        "coverage": {
            "from": min(x["drawDate"] for x in maxmillions),
            "through": max(x["drawDate"] for x in maxmillions),
        },
        "recordCount": len(maxmillions),
        "incompleteRowsExcluded": len(exceptions),
        "note": (
            "Only complete seven-number MAXMILLIONS rows were imported. The "
            "incomplete rows below require source-level review. MAXPLUS is not "
            "contained in this WCLC since-inception archive and is not included here."
        ),
        "sources": [
            {
                "role": "primary",
                "name": "WCLC",
                "url": "https://www.wclc.com/display-on/display-on-downloads/lotto-max-since-inception.htm",
            }
        ],
        "records": maxmillions,
        "exceptions": exceptions,
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / "draws.json").write_text(
        json.dumps(draws_payload, indent=2) + "\n", encoding="utf-8"
    )
    (OUTPUT_DIR / "maxmillions.json").write_text(
        json.dumps(mm_payload, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"Built {len(all_draws)} main draws: "
        f"{all_draws[0]['drawDate']} to {all_draws[-1]['drawDate']}"
    )
    print(
        f"Built {len(maxmillions)} complete MAXMILLIONS records; "
        f"excluded {len(exceptions)} incomplete rows"
    )
    print("EXTRA was excluded from the generated datasets.")


if __name__ == "__main__":
    main()
