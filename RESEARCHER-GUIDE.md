# Researcher Guide — HR Service Desk Tree Test

Step-by-step workflow for running and analysing a tree test session.

---

## Tools at a glance

| Tool | URL | Who uses it |
|---|---|---|
| Tree test — NL | https://blork02.github.io/tree-test-standalone/?lang=nl | Participants |
| Tree test — FR | https://blork02.github.io/tree-test-standalone/?lang=fr | Participants |
| Admin / content editor | https://blork02.github.io/tree-test-standalone/admin.html | Researcher |
| CSV merger | https://blork02.github.io/tree-test-standalone/merge-csv.html | Researcher |
| Path analysis | https://blork02.github.io/tree-test-standalone/path-analysis.html | Researcher |
| Test data generator | https://blork02.github.io/tree-test-standalone/generate-test-data.html | Researcher (testing only) |

---

## Step 1 — Set up the content (one-time)

If you need to change tasks, tree labels, or instructions:

1. Open the **Admin editor**: https://blork02.github.io/tree-test-standalone/admin.html
2. Edit tasks, tree labels (NL and FR side by side), and instruction text.
3. Click **Export config.js** — this downloads a new `config.js` file.
4. Replace the `config.js` file in the GitHub repository with the downloaded one.
5. GitHub Pages will update automatically within a minute or two.

> The admin editor only saves when you export. Refreshing the page discards unsaved changes.

---

## Step 2 — Recruit participants

Send participants the link for their language:

- **NL participants**: https://blork02.github.io/tree-test-standalone/?lang=nl
- **FR participants**: https://blork02.github.io/tree-test-standalone/?lang=fr

The link skips the language selector screen. The participant ID is auto-generated (e.g. `P-3847`) — participants can edit it if you want to use your own codes.

---

## Step 3 — Participants complete the session

The tool is fully self-guided. The participant:

1. Reads the instructions.
2. Completes a short pre-test questionnaire (computer use, HR portal familiarity).
3. Completes all tree-test tasks in a randomised order.
4. After each task: rates confidence (1–5) and optionally leaves a comment.
5. Completes the post-study questionnaire (overall ease, hardest categories, open comment).
6. **Downloads their results as a CSV file** from the final screen.

The participant must share that CSV file with you — by email, file upload form, Teams, etc.

> Nothing is sent to a server automatically. The researcher must collect the CSVs manually.

---

## Step 4 — Merge participant CSVs

Once you have received CSV files from participants:

1. Open the **CSV merger**: https://blork02.github.io/tree-test-standalone/merge-csv.html
2. Drag all participant CSV files into the drop zone (or click "Select files").
3. The tool shows a summary table: participant ID, language, task count, pre-test and post-study presence.
4. Check for any warnings (duplicate IDs, parse errors).
5. Click **Download merged CSV** — this produces a single file named `tree-test-merged-YYYY-MM-DD.csv`.

You can add files incrementally: click "Add more files" to append new participants to an existing set before downloading.

---

## Step 5 — Visualise navigation paths

1. Open **Path analysis**: https://blork02.github.io/tree-test-standalone/path-analysis.html
2. Drag the merged CSV into the drop zone.
3. Each task appears as a collapsible section with:
   - **Summary stats**: N participants, % correct, % first-click correct (first-answer attempt), median time, mean confidence.
   - **Path flow explorer**: a collapsible trie of navigation paths (which branches participants opened, in sequence). Colour-coded: green = correct, red shades = wrong.
   - **First opened category (first click)**: pie chart showing which Tier-1 category participants navigated into first. Green slice = the category containing the correct answer. This is the tree-test "first click" metric.

> The "First opened category" chart and "% first-click correct" in the summary bar measure different things:
> - **First opened category** = the Tier-1 *branch* participants opened first (navigation direction).
> - **First-click correct** = whether the first *leaf* they selected matched the correct answer.

---

## Step 6 — Deep analysis with Claude

For a full written analysis (overview table, per-task path flow, wrong answers, post-study summary):

1. Paste all participant CSV content into a Claude conversation, or upload the merged CSV.
2. Include or paste the **Analysis Protocol** from `ANALYSIS.md`.
3. Claude will produce:
   - An overview table (N, % correct, % first-click correct, median time, mean confidence) per task.
   - Per-task path flow (first opened, wrong answers, backtrack rate).
   - First-answer-attempt frequency table per task.
   - Post-study ease rating distribution, hardest categories, open comments.
   - Optional pre-test profile.

The full column reference and prompt template are in [`ANALYSIS.md`](ANALYSIS.md).

---

## Step 7 — Test without real participants (optional)

To verify the analysis tools before running real sessions:

1. Open **Test data generator**: https://blork02.github.io/tree-test-standalone/generate-test-data.html
2. Enter a number of simulated participants and click Generate.
3. Download the synthetic CSV.
4. Drop it directly into **Path analysis** (no merging needed — it already contains multiple participants).

The generator simulates five behaviour archetypes: direct, indirect exploration, indirect selection (backtrack), close miss, and wrong branch.

---

## Key concepts

| Term | Meaning |
|---|---|
| `first_opened` | The Tier-1 category a participant opened first — the navigation direction signal |
| `first_click` | The first *leaf node* a participant clicked (first answer attempt, may differ from final answer) |
| `correct` | Whether the *final confirmed answer* matches the correct node ID |
| `n_backtrack` | How many times a participant changed their leaf selection before confirming (0 = went straight) |
| `confidence` | Per-task self-reported confidence 1–5 (1 = not confident, 5 = very confident) |
| `ease` | Post-study overall ease rating 1–5 |
