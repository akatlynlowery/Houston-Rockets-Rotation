# 🏀 Basketball Analytics Portfolio — Houston Rockets Project

## 👋 About Me

I’m an IT and Network Systems Technology student with hands-on experience in help desk support and software development, pursuing a career in **sports analytics**.

This project demonstrates my ability to combine **data analysis, programming, and basketball knowledge** to build tools similar to what an NBA analytics department would use.

---

## 🚀 Project Overview

This is a basketball analytics dashboard and modeling project focused on the **2025–26 Houston Rockets**.

It simulates how a front office analyst would:

* Evaluate player roles
* Optimize lineups
* Translate data into real basketball decisions

👉 Open `index.html` to view the interactive dashboard.

---

## 🔍 Key Features

* **Lineup Optimizer**

  * Scores 5-man lineups based on spacing, defense, rebounding, and turnover risk
  * Simulates decision-making used in roster construction

* **Player Role Analysis**

  * Uses advanced + per-game stats to classify player roles
  * Designed for quick coach/scout interpretation

* **Front Office Memo**

  * Converts model output into clear basketball recommendations
  * Shows ability to communicate insights, not just build models

* **Full Data Stack**

  * SQL database for querying player + lineup data
  * R script for rebuilding and validating lineup models
  * CSV-based pipeline for reproducibility

---

## 🛠️ Skills Demonstrated

* **Programming:** SQL, R
* **Data Analysis:** Statistical modeling, lineup evaluation
* **Data Engineering:** Data pipelines, database design
* **Sports Analytics:** Player evaluation, lineup construction
* **Communication:** Translating data into actionable insights

---

## 📊 Data Sources

* Basketball Reference (public NBA data)
* 2025–26 Houston Rockets roster + schedule

This project intentionally uses public data while demonstrating how it could scale to:

* Player tracking data (Second Spectrum)
* Play-type data
* Matchup and possession-level analysis

---

## 🧠 Why This Project Matters

This project highlights the core skills NBA teams look for in analysts:

* Structured problem solving
* Reproducible workflows
* Clear assumptions
* Basketball-first thinking
* Ability to communicate insights to non-technical staff

---

## ⚙️ How to Run

```bash
sqlite3 rockets_rotation.db ".read sql/schema.sql"
sqlite3 rockets_rotation.db ".mode csv" ".import --skip 1 data/player_stats.csv player_stats"
sqlite3 rockets_rotation.db < sql/analysis_queries.sql
Rscript r/lineup_model.R
```

---

## 📌 Takeaway

This project reflects my goal of working in **basketball analytics**, combining my technical background with my passion for sports to build tools that support real team decision-making.
