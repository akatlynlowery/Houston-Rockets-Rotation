const players = [
  { name: "Amen Thompson", pos: "PG", g: 79, gs: 79, mpg: 37.4, pts: 18.3, reb: 7.8, ast: 5.3, stl: 1.5, blk: 0.6, tov: 2.4, fg3p: 0.216, efg: 0.545, ts: 0.594, usg: 20.0, bpm: 2.6, vorp: 3.4 },
  { name: "Kevin Durant", pos: "SF", g: 78, gs: 78, mpg: 36.4, pts: 26.0, reb: 5.5, ast: 4.8, stl: 0.8, blk: 0.9, tov: 3.2, fg3p: 0.413, efg: 0.588, ts: 0.641, usg: 27.1, bpm: 4.5, vorp: 4.7 },
  { name: "Jabari Smith Jr.", pos: "PF", g: 77, gs: 77, mpg: 35.1, pts: 15.8, reb: 6.9, ast: 1.9, stl: 0.7, blk: 0.9, tov: 1.4, fg3p: 0.363, efg: 0.541, ts: 0.570, usg: 18.2, bpm: -0.7, vorp: 0.9 },
  { name: "Alperen Sengun", pos: "C", g: 72, gs: 72, mpg: 33.3, pts: 20.4, reb: 8.9, ast: 6.2, stl: 1.2, blk: 1.1, tov: 3.2, fg3p: 0.305, efg: 0.537, ts: 0.569, usg: 26.6, bpm: 4.2, vorp: 3.7 },
  { name: "Reed Sheppard", pos: "SG", g: 82, gs: 21, mpg: 26.2, pts: 13.5, reb: 2.9, ast: 3.4, stl: 1.5, blk: 0.7, tov: 1.5, fg3p: 0.394, efg: 0.550, ts: 0.564, usg: 21.7, bpm: 2.7, vorp: 2.5 },
  { name: "Tari Eason", pos: "PF", g: 60, gs: 34, mpg: 25.8, pts: 10.5, reb: 6.3, ast: 1.5, stl: 1.2, blk: 0.5, tov: 1.4, fg3p: 0.358, efg: 0.496, ts: 0.514, usg: 18.7, bpm: -1.6, vorp: 0.2 },
  { name: "Steven Adams", pos: "C", g: 32, gs: 11, mpg: 22.8, pts: 5.8, reb: 8.6, ast: 1.5, stl: 0.7, blk: 0.6, tov: 1.1, fg3p: 0.000, efg: 0.504, ts: 0.535, usg: 12.1, bpm: -0.5, vorp: 0.3 },
  { name: "Josh Okogie", pos: "SG", g: 78, gs: 32, mpg: 17.4, pts: 4.5, reb: 2.6, ast: 0.9, stl: 0.8, blk: 0.2, tov: 0.5, fg3p: 0.385, efg: 0.531, ts: 0.544, usg: 11.3, bpm: -1.2, vorp: 0.3 },
  { name: "Dorian Finney-Smith", pos: "PF", g: 37, gs: 1, mpg: 16.8, pts: 3.3, reb: 2.5, ast: 1.0, stl: 0.4, blk: 0.2, tov: 0.6, fg3p: 0.270, efg: 0.436, ts: 0.452, usg: 10.7, bpm: -4.3, vorp: -0.4 },
  { name: "Aaron Holiday", pos: "PG", g: 57, gs: 1, mpg: 13.7, pts: 5.5, reb: 1.0, ast: 1.1, stl: 0.5, blk: 0.1, tov: 0.7, fg3p: 0.394, efg: 0.550, ts: 0.578, usg: 16.6, bpm: -2.4, vorp: -0.1 },
  { name: "Clint Capela", pos: "C", g: 75, gs: 3, mpg: 12.3, pts: 3.8, reb: 4.6, ast: 0.7, stl: 0.5, blk: 0.8, tov: 0.5, fg3p: 0.500, efg: 0.522, ts: 0.540, usg: 13.7, bpm: 0.4, vorp: 0.6 }
];

let selected = ["Amen Thompson", "Kevin Durant", "Jabari Smith Jr.", "Alperen Sengun", "Reed Sheppard"];

const $ = (id) => document.getElementById(id);
const fmtPct = (value) => value ? `${Math.round(value * 1000) / 10}%` : "-";
const avg = (lineup, key) => lineup.reduce((sum, player) => sum + player[key], 0) / Math.max(lineup.length, 1);
const sum = (lineup, key) => lineup.reduce((total, player) => total + player[key], 0);
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

function roleFor(player) {
  if (player.name === "Kevin Durant") return "primary scorer";
  if (player.name === "Alperen Sengun") return "hub center";
  if (player.name === "Amen Thompson") return "pressure guard";
  if (player.fg3p >= .38 && player.ast >= 2.5) return "skill spacer";
  if (player.reb >= 6 && player.stl >= 1) return "defensive wing";
  if (player.pos === "C") return "screen/rebound big";
  if (player.fg3p >= .36) return "spacing guard";
  return "depth connector";
}

function lineupScores(lineup) {
  const spacing = clamp((avg(lineup, "fg3p") - .285) * 330);
  const creation = clamp((sum(lineup, "ast") * 5.4) + (sum(lineup, "usg") - 80) * .35);
  const defense = clamp((sum(lineup, "stl") * 7.5) + (sum(lineup, "blk") * 5.2) + (sum(lineup, "bpm") * 2.3) + 26);
  const rebounding = clamp(sum(lineup, "reb") * 2.65);
  const care = clamp(100 - sum(lineup, "tov") * 8.2);
  const roleBonus = lineup.some((p) => p.name === "Kevin Durant") && lineup.some((p) => p.name === "Alperen Sengun") ? 7 : 0;
  const score = clamp((spacing * .22) + (creation * .25) + (defense * .20) + (rebounding * .16) + (care * .17) + roleBonus);

  return { spacing, creation, defense, rebounding, care, score };
}

function combinations(list, size) {
  if (size === 0) return [[]];
  if (list.length < size) return [];
  const [first, ...rest] = list;
  return [
    ...combinations(rest, size - 1).map((combo) => [first, ...combo]),
    ...combinations(rest, size)
  ];
}

function bestLineup() {
  return combinations(players, 5)
    .map((lineup) => ({ lineup, score: lineupScores(lineup).score }))
    .sort((a, b) => b.score - a.score)[0].lineup.map((p) => p.name);
}

function renderToggles() {
  $("playerToggles").innerHTML = players.map((player) => {
    const active = selected.includes(player.name) ? "active" : "";
    return `
      <button class="player-toggle ${active}" type="button" data-player="${player.name}">
        <span><strong>${player.name}</strong><span>${player.pos} · ${roleFor(player)}</span></span>
        <span>${player.mpg.toFixed(1)} MPG</span>
      </button>
    `;
  }).join("");

  document.querySelectorAll(".player-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.player;
      if (selected.includes(name)) {
        selected = selected.filter((player) => player !== name);
      } else if (selected.length < 5) {
        selected = [...selected, name];
      } else {
        selected = [...selected.slice(1), name];
      }
      render();
    });
  });
}

function renderRadar(scores) {
  const rows = [
    ["Creation", scores.creation],
    ["Spacing", scores.spacing],
    ["Defense", scores.defense],
    ["Rebounding", scores.rebounding],
    ["Ball care", scores.care]
  ];

  $("radar").innerHTML = rows.map(([label, value]) => `
    <div class="bar-row">
      <span>${label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
      <strong>${Math.round(value)}</strong>
    </div>
  `).join("");
}

function renderInsights(lineup, scores) {
  if (lineup.length !== 5) {
    $("insightList").innerHTML = "<li>Select exactly five players to activate the model read.</li>";
    return;
  }

  const names = lineup.map((p) => p.name);
  const insights = [];
  const shooters = lineup.filter((p) => p.fg3p >= .36).length;
  const creators = lineup.filter((p) => p.ast >= 3.0 || p.usg >= 24).length;

  insights.push(`${creators} creation hubs and ${shooters} credible shooters gives this group a ${Math.round(scores.score)} overall grade.`);
  if (names.includes("Amen Thompson") && shooters < 3) insights.push("Amen lineups need cleaner spacing; add one more high-volume shooter before using this as a late-game offensive group.");
  if (names.includes("Kevin Durant") && names.includes("Alperen Sengun")) insights.push("Durant plus Sengun protects the half-court floor: one elite shot-maker and one passing big can solve switches without overhelp.");
  if (sum(lineup, "tov") > 11) insights.push("Turnover load is the main concern. The next film cut should isolate first-pass decisions after traps and nail help.");
  if (scores.defense > 70) insights.push("The defensive event profile is strong enough to support aggressive coverages and transition chances after misses.");

  $("insightList").innerHTML = insights.map((text) => `<li>${text}</li>`).join("");
}

function renderTable() {
  $("playerRows").innerHTML = players.map((player) => `
    <tr>
      <td><strong>${player.name}</strong></td>
      <td class="role">${roleFor(player)}</td>
      <td>${player.mpg.toFixed(1)}</td>
      <td>${player.pts.toFixed(1)}</td>
      <td>${player.ast.toFixed(1)}</td>
      <td>${fmtPct(player.fg3p)}</td>
      <td>${fmtPct(player.ts)}</td>
      <td>${player.bpm.toFixed(1)}</td>
    </tr>
  `).join("");
}

function render() {
  const lineup = selected.map((name) => players.find((player) => player.name === name)).filter(Boolean);
  const scores = lineupScores(lineup);
  $("lineupName").textContent = lineup.length ? lineup.map((player) => {
    const parts = player.name.split(" ");
    return parts[parts.length - 1];
  }).join(" · ") : "Select five players";
  $("lineupScore").textContent = lineup.length === 5 ? Math.round(scores.score) : "--";
  renderToggles();
  renderRadar(scores);
  renderInsights(lineup, scores);
}

$("bestLineup").addEventListener("click", () => {
  selected = bestLineup();
  render();
});

$("resetLineup").addEventListener("click", () => {
  selected = ["Amen Thompson", "Kevin Durant", "Jabari Smith Jr.", "Alperen Sengun", "Reed Sheppard"];
  render();
});

renderTable();
render();
