# Houston Rockets Basketball Analytics Portfolio Project

This project is designed to be shown to the Houston Rockets as a basketball operations analyst portfolio piece.

Open [index.html](index.html) in a browser to use the dashboard.

## What It Shows

- Rotation-level decision support for the 2025-26 Rockets.
- Player role cards using current public per-game and advanced statistics.
- A simple lineup optimizer that scores five-man groups on creation, spacing, defense, rebounding, and turnover risk.
- A front-office memo that turns the model output into concrete basketball recommendations.
- SQL scripts that create/query a player stats table and five-man lineup candidates.
- An R model script that rebuilds lineup rankings from the same CSV source.

## Why This Helps In An Interview

The goal is not to pretend public data can replace internal tracking, play-type, medical, and lineup data. The goal is to show the exact habits an NBA analytics staff wants:

- Clear problem framing.
- Reproducible data sourcing.
- Transparent assumptions.
- Basketball translation, not just charts.
- A tool coaches and scouts could understand quickly.

## Data

The embedded data was pulled from Basketball-Reference public 2025-26 Houston Rockets pages on May 30, 2026:

- Roster and stats: https://www.basketball-reference.com/teams/HOU/2026.html
- Schedule and results: https://www.basketball-reference.com/teams/HOU/2026_games.html

The lineup model is intentionally interpretable. It uses public box-score and advanced metrics, then applies basketball-weighted heuristics for role balance. In a real front-office environment, this would be upgraded with possession-level lineup data, second-spectrum tracking, opponent matchup data, play calls, and availability constraints.

## SQL + R

The project includes a small analytics stack:

- `data/player_stats.csv`: shared player-level dataset.
- `sql/schema.sql`: SQLite-compatible table and role view.
- `sql/analysis_queries.sql`: basketball questions written as SQL.
- `r/lineup_model.R`: R script that scores all rotation lineups and writes reports.

Example commands:

```sh
sqlite3 rockets_rotation.db ".read sql/schema.sql"
sqlite3 rockets_rotation.db ".mode csv" ".import --skip 1 data/player_stats.csv player_stats"
sqlite3 rockets_rotation.db < sql/analysis_queries.sql
Rscript r/lineup_model.R
```

The R command requires a local R installation with `Rscript` available.
