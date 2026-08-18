// Pulls the paper's receipts from data/results.json so every number on the page
// traces back to one file instead of being hand-typed in multiple places.
async function loadResults() {
  try {
    const res = await fetch("data/results.json");
    if (!res.ok) throw new Error("results.json not found");
    return await res.json();
  } catch (err) {
    console.error("Could not load data/results.json:", err);
    return null;
  }
}

function fmtInt(n) {
  return n.toLocaleString("en-US");
}

function renderDataStats(d) {
  const stats = [
    { n: fmtInt(d.data.march_eligible_pages), l: "March-eligible pages with GSC data" },
    { n: fmtInt(d.data.matched_april_pages), l: "pages with a matched April outcome" },
    { n: fmtInt(d.data.distinct_clients), l: "distinct pseudonymous clients" },
    { n: (d.data.april_partition_rows / 1e6).toFixed(1) + "M", l: "rows in the April daily-fact partition alone" },
  ];
  const el = document.getElementById("data-stats");
  if (!el) return;
  el.innerHTML = stats
    .map((s) => `<div class="stat"><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`)
    .join("");
}

function renderMonitoringTable(d) {
  const el = document.getElementById("monitoring-table-body");
  if (!el) return;
  el.innerHTML = d.monitoring_triggers
    .map((row) => `<tr><td>${row.signal}</td><td>${row.trigger}</td></tr>`)
    .join("");
}

function renderRepro(d) {
  const el = document.getElementById("repro-list");
  if (!el) return;
  el.innerHTML = d.reproducibility.notebooks
    .map((nb) => `<li><a href="${nb.url}">${nb.label}</a></li>`)
    .join("");
  const seedEl = document.getElementById("seed-value");
  if (seedEl) seedEl.textContent = d.reproducibility.seed;
}

(async function init() {
  const d = await loadResults();
  if (!d) return; // static HTML already has the numbers written in prose as a fallback
  renderDataStats(d);
  renderMonitoringTable(d);
  renderRepro(d);
})();
