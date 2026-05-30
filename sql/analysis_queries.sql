-- Rotation questions an NBA analytics interviewer can scan quickly.

-- 1. Which players combine shooting, passing, and positive impact?
SELECT
  player,
  pos,
  ROUND(fg3p * 100, 1) AS three_pt_pct,
  ast,
  bpm,
  role
FROM rotation_roles
WHERE mpg >= 12
ORDER BY bpm DESC, three_pt_pct DESC;

-- 2. Who are the best spacing options around Amen Thompson and Alperen Sengun?
SELECT
  player,
  pos,
  ROUND(fg3p * 100, 1) AS three_pt_pct,
  ROUND(ts * 100, 1) AS true_shooting_pct,
  bpm
FROM player_stats
WHERE player NOT IN ('Amen Thompson', 'Alperen Sengun')
  AND mpg >= 12
ORDER BY fg3p DESC, bpm DESC;

-- 3. Find five-man lineup candidates with enough creation and spacing.
WITH five_man AS (
  SELECT
    a.player AS p1,
    b.player AS p2,
    c.player AS p3,
    d.player AS p4,
    e.player AS p5,
    (a.ast + b.ast + c.ast + d.ast + e.ast) AS ast_sum,
    (a.tov + b.tov + c.tov + d.tov + e.tov) AS tov_sum,
    (a.reb + b.reb + c.reb + d.reb + e.reb) AS reb_sum,
    (a.bpm + b.bpm + c.bpm + d.bpm + e.bpm) AS bpm_sum,
    ((a.fg3p + b.fg3p + c.fg3p + d.fg3p + e.fg3p) / 5.0) AS avg_3p
  FROM player_stats a
  JOIN player_stats b ON b.player > a.player
  JOIN player_stats c ON c.player > b.player
  JOIN player_stats d ON d.player > c.player
  JOIN player_stats e ON e.player > d.player
  WHERE a.mpg >= 12 AND b.mpg >= 12 AND c.mpg >= 12 AND d.mpg >= 12 AND e.mpg >= 12
)
SELECT
  p1 || ' / ' || p2 || ' / ' || p3 || ' / ' || p4 || ' / ' || p5 AS lineup,
  ROUND(avg_3p * 100, 1) AS avg_3p_pct,
  ROUND(ast_sum, 1) AS assists,
  ROUND(reb_sum, 1) AS rebounds,
  ROUND(tov_sum, 1) AS turnovers,
  ROUND(bpm_sum, 1) AS bpm_sum,
  ROUND((avg_3p * 100) + (ast_sum * 1.5) + (reb_sum * 0.7) + (bpm_sum * 2.0) - (tov_sum * 1.8), 1) AS sql_lineup_score
FROM five_man
ORDER BY sql_lineup_score DESC
LIMIT 10;
