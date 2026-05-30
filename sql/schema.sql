-- SQLite-compatible schema for the Rockets Rotation Lab.
-- Load from the command line:
--   sqlite3 rockets_rotation.db ".read sql/schema.sql"
--   sqlite3 rockets_rotation.db ".mode csv" ".import --skip 1 data/player_stats.csv player_stats"

DROP TABLE IF EXISTS player_stats;

CREATE TABLE player_stats (
  player TEXT PRIMARY KEY,
  pos TEXT NOT NULL,
  g INTEGER NOT NULL,
  gs INTEGER NOT NULL,
  mpg REAL NOT NULL,
  pts REAL NOT NULL,
  reb REAL NOT NULL,
  ast REAL NOT NULL,
  stl REAL NOT NULL,
  blk REAL NOT NULL,
  tov REAL NOT NULL,
  fg3p REAL NOT NULL,
  efg REAL NOT NULL,
  ts REAL NOT NULL,
  usg REAL NOT NULL,
  bpm REAL NOT NULL,
  vorp REAL NOT NULL
);

DROP VIEW IF EXISTS rotation_roles;

CREATE VIEW rotation_roles AS
SELECT
  player,
  pos,
  mpg,
  pts,
  ast,
  fg3p,
  ts,
  bpm,
  CASE
    WHEN player = 'Kevin Durant' THEN 'primary scorer'
    WHEN player = 'Alperen Sengun' THEN 'hub center'
    WHEN player = 'Amen Thompson' THEN 'pressure guard'
    WHEN fg3p >= 0.380 AND ast >= 2.5 THEN 'skill spacer'
    WHEN reb >= 6.0 AND stl >= 1.0 THEN 'defensive wing'
    WHEN pos = 'C' THEN 'screen/rebound big'
    WHEN fg3p >= 0.360 THEN 'spacing guard'
    ELSE 'depth connector'
  END AS role
FROM player_stats;
