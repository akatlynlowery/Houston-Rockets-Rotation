#!/usr/bin/env python3
"""
Fetch a public-data Rockets snapshot from Basketball-Reference.

This is intentionally dependency-free so it can run in a clean Python install:

    python3 scripts/fetch_public_data.py > rockets_2026_snapshot.json

The dashboard embeds a curated snapshot for portability, but this script shows
how the source data can be refreshed and audited.
"""

from html.parser import HTMLParser
from html import unescape
import json
import re
from urllib.request import Request, urlopen


SOURCE = "https://www.basketball-reference.com/teams/HOU/2026.html"


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_row = False
        self.in_cell = False
        self.stat = None
        self.text = []
        self.row = {}
        self.rows = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "tr":
            self.in_row = True
            self.row = {}
        if self.in_row and tag in ("td", "th"):
            self.in_cell = True
            self.stat = attrs.get("data-stat")
            self.text = []

    def handle_endtag(self, tag):
        if self.in_cell and tag in ("td", "th"):
            if self.stat:
                self.row[self.stat] = unescape("".join(self.text)).strip()
            self.in_cell = False
        if self.in_row and tag == "tr":
            if self.row and self.row.get("ranker") != "Rk":
                self.rows.append(self.row)
            self.in_row = False

    def handle_data(self, data):
        if self.in_cell:
            self.text.append(data)


def parse_table(html, table_id):
    html = html.replace("<!--", "").replace("-->", "")
    match = re.search(r'<table[^>]*id="' + re.escape(table_id) + r'"[\s\S]*?</table>', html)
    if not match:
        raise ValueError(f"Could not find table {table_id}")
    parser = TableParser()
    parser.feed(match.group(0))
    return parser.rows


def number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def pct(value):
    return number("0" + value) if value else 0.0


def main():
    request = Request(SOURCE, headers={"User-Agent": "portfolio-data-script/1.0"})
    html = urlopen(request, timeout=20).read().decode("utf-8")
    per_game = parse_table(html, "per_game_stats")
    advanced = {row.get("name_display"): row for row in parse_table(html, "advanced") if row.get("name_display")}

    players = []
    for row in per_game:
        name = row.get("name_display")
        if not name or name == "Team Totals":
            continue
        if number(row.get("mp_per_g")) < 8 and number(row.get("games")) < 20:
            continue
        adv = advanced.get(name, {})
        players.append({
            "name": name,
            "pos": row.get("pos"),
            "g": int(number(row.get("games"))),
            "mpg": number(row.get("mp_per_g")),
            "pts": number(row.get("pts_per_g")),
            "reb": number(row.get("trb_per_g")),
            "ast": number(row.get("ast_per_g")),
            "fg3p": pct(row.get("fg3_pct")),
            "ts": pct(adv.get("ts_pct")),
            "usg": number(adv.get("usg_pct")),
            "bpm": number(adv.get("bpm")),
            "vorp": number(adv.get("vorp")),
        })

    print(json.dumps({"source": SOURCE, "players": players}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
