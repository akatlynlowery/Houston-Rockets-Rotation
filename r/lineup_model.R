# Houston Rockets Rotation Lab: R modeling layer
#
# Run from the project root:
#   Rscript r/lineup_model.R
#
# Output:
#   reports/lineup_rankings.csv
#   reports/player_role_scores.csv

dir.create("reports", showWarnings = FALSE)

players <- read.csv("data/player_stats.csv", stringsAsFactors = FALSE)

score_lineup <- function(lineup) {
  spacing <- max(0, min(100, (mean(lineup$fg3p) - 0.285) * 330))
  creation <- max(0, min(100, (sum(lineup$ast) * 5.4) + ((sum(lineup$usg) - 80) * 0.35)))
  defense <- max(0, min(100, (sum(lineup$stl) * 7.5) + (sum(lineup$blk) * 5.2) + (sum(lineup$bpm) * 2.3) + 26))
  rebounding <- max(0, min(100, sum(lineup$reb) * 2.65))
  ball_care <- max(0, min(100, 100 - (sum(lineup$tov) * 8.2)))
  role_bonus <- if (all(c("Kevin Durant", "Alperen Sengun") %in% lineup$player)) 7 else 0

  round(
    (spacing * 0.22) +
      (creation * 0.25) +
      (defense * 0.20) +
      (rebounding * 0.16) +
      (ball_care * 0.17) +
      role_bonus,
    1
  )
}

rotation <- subset(players, mpg >= 12)
combos <- combn(rotation$player, 5, simplify = FALSE)

lineup_rankings <- do.call(rbind, lapply(combos, function(names) {
  lineup <- rotation[rotation$player %in% names, ]
  data.frame(
    lineup = paste(names, collapse = " / "),
    score = score_lineup(lineup),
    avg_3p = round(mean(lineup$fg3p), 3),
    ast_sum = round(sum(lineup$ast), 1),
    reb_sum = round(sum(lineup$reb), 1),
    tov_sum = round(sum(lineup$tov), 1),
    bpm_sum = round(sum(lineup$bpm), 1),
    stringsAsFactors = FALSE
  )
}))

lineup_rankings <- lineup_rankings[order(-lineup_rankings$score), ]

players$role_score <- round(
  scale(players$ts)[, 1] +
    scale(players$bpm)[, 1] +
    scale(players$vorp)[, 1] +
    (scale(players$ast)[, 1] * 0.6) +
    (scale(players$reb)[, 1] * 0.4),
  2
)

write.csv(lineup_rankings, "reports/lineup_rankings.csv", row.names = FALSE)
write.csv(players[order(-players$role_score), ], "reports/player_role_scores.csv", row.names = FALSE)

cat("Top Rockets lineup by public-data model:\n")
print(head(lineup_rankings, 5), row.names = FALSE)
