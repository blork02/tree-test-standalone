# Tree Test — Combined Report Guide

How to produce a structured Obsidian-ready Markdown report from both the merged CSV and the exported `.md` file from `path-analysis.html`. No Figma, no PPT generation, no token-burning side quests.

## Why two inputs?

| Input | What it gives you |
|---|---|
| Merged CSV (`tree-test-merged-*.csv`) | Raw participant-level data — individual paths, timings, first-click sequences, verbatim comments. Claude can recompute anything from scratch and cross-check figures. |
| Exported report (`.md` from path-analysis.html) | Pre-computed aggregates, outcome classifications, catastrophe flags, Bayesian comparison stats (if Compare tab was active). Faster to parse; guarantees consistency with what you saw on screen. |

Together: Claude gets both the raw signal and the processed interpretation, catches discrepancies, and produces a richer report than either source alone.

---

## Step 1 — Export from path-analysis.html

1. Upload your merged CSV to `path-analysis.html`
2. Let all tasks render
3. Click **↓ Export Report**
   - If the **single iteration tab** is active → `tree-test-report-YYYY-MM-DD.md`
   - If the **Compare tab** is active (two iterations loaded) → `tree-test-comparison-YYYY-MM-DD.md`

Keep both files. You will attach both to the Claude conversation in Step 2.

---

## Step 2 — Open a new Claude conversation

Attach:
- The merged CSV file
- The exported `.md` report

Then send this prompt (copy-paste as-is, or paste the full block from the section below).

**Report language:** Both prompt templates below default to English. To get a French report instead, replace the language line with:
> Write the report in **French**. Dutch task scenarios, tree labels, and participant quotes must remain verbatim in Dutch — everything else (headers, interpretation, recommendations, methodology) in French.

---

## Prompt template — single iteration

> You are helping a UX researcher write a report on a tree test study for an HR service desk navigation redesign.
>
> I'm attaching two files:
> 1. A merged CSV with all participant data (one row per task per participant, plus `pre_test` and `post_study` rows)
> 2. An exported `.md` report from the path-analysis tool, which contains pre-computed aggregates and outcome classifications
>
> **Your job:** Produce a structured report in Markdown format, suitable for Obsidian. Write the report in **English** — except for Dutch task scenarios, tree labels, and participant quotes, which must stay verbatim in Dutch. *(Replace "English" with "French" if you want a French-language report.)*
>
> Cross-check figures between the two files where possible. If you spot a discrepancy, use the CSV as ground truth and note the difference.
>
> **Report structure to produce:**
>
> ### Frontmatter
> YAML block: study name, export date, N participants, languages, N tasks.
>
> ### Executive summary
> 3–5 bullet points. Lead with the most important finding. Include overall accuracy rate, catastrophe count, and one clear recommendation.
>
> ### Overview table
> One row per task. Columns: Task ID | Scenario (Dutch, max 60 chars) | N | % correct | % first-click correct | Median time (s) | Mean confidence | Catastrophes
> Sort by task ID.
>
> ### Per-task analysis
> For each task, one collapsible `<details>` block (so the report doesn't become a wall of text). Structure inside each block:
>
> ```
> #### Task [N] — [scenario, Dutch, max 80 chars]
>
> **Correct answer:** [label, Dutch]
> **Accuracy:** X/N (XX%) | **First-click correct:** X/N (XX%) | **Median time:** Xs | **Mean confidence:** X.X
>
> **Outcome breakdown:** Direct X% · Indirect X% · Close X% · Wrong X%
>
> **First opened (Tier-1 first click):**
> | Category (Dutch) | N | % | → correct |
>
> **Wrong answers (top 3):**
> | Path (Dutch) | N |
>
> **Catastrophes:** X (wrong AND confidence ≥ 4)
> [If any: list participant IDs and their path]
>
> **Backtrack rate:** X% changed selection at least once
>
> **Participant comments:**
> [Verbatim, in Dutch, one per line, indented as blockquote]
>
> **Interpretation:**
> [2–4 sentences in English: what caused errors, what the first-click data reveals, any label confusion pattern]
> ```
>
> ### Post-study analysis
> - Ease rating distribution (1–5), mean
> - Perception adjectives: frequency table, sorted descending
> - Open-ended adjectives (`structure_other`): verbatim list
> - Open comments: verbatim list with participant ID
>
> ### Pre-test profile
> One stacked frequency table per pre-test question. Summarize in 2 sentences: who the participants are digitally.
>
> ### Recommendations
> 3–6 actionable IA changes, ordered by severity (highest failure rate or catastrophe count first). Format:
>
> ```
> 1. **[Label or category to fix]** — [what to change and why, 2 sentences max]
>    Affects: task3, task7 | Failure rate: 65% | Catastrophes: 3
> ```
>
> ### Methodology note
> One short paragraph: N participants, languages, randomized task order (seeded LCG), confidence scale 1–5, catastrophe definition (wrong AND confidence ≥ 4), outcome classification (direct / indirect / close / wrong).

---

## Prompt template — comparing two iterations

Use this instead when you have both a v1 and a v2 report (or a single exported comparison `.md` from the Compare tab).

> You are helping a UX researcher write a before/after report comparing two iterations of a tree test study on an HR service desk navigation.
>
> I'm attaching:
> 1. The merged CSV for v2 (or both v1 and v2 CSVs if available)
> 2. The exported comparison `.md` from the path-analysis Compare tab (contains Bayesian P(v2 better) values, accuracy shifts, first-click deltas, catastrophe deltas)
>
> **Your job:** Produce a structured comparison report in Markdown, suitable for Obsidian. Write in **English** (or **French** — replace as needed) — Dutch for scenarios, labels, and verbatim quotes only.
>
> **Report structure:**
>
> ### Frontmatter
> YAML: study name, v1 label + date + N, v2 label + date + N, export date.
>
> ### Executive summary
> Did the redesign work? 3–4 bullet points: overall accuracy shift, number of tasks that clearly improved (P ≥ 0.75), catastrophe trend, one open question.
>
> ### Overall accuracy shift
> Table: Overall v1 % correct → v2 % correct, Δ pp, P(v2 better overall).
>
> ### Per-task comparison table
> | Task | Scenario (Dutch, 60 chars) | Acc v1 | Acc v2 | Δ pp | P(v2 better) | Verdict | FC v1 | FC v2 | FC Δ | Catast. v1→v2 |
>
> Sort by P(v2 better) descending.
>
> Verdict labels: **Strong ↑** (P ≥ 0.95) · **Likely ↑** (P ≥ 0.75) · **Unclear** (P 0.25–0.74) · **Likely ↓** (P ≤ 0.25) · **Strong ↓** (P ≤ 0.05)
>
> ### Task deep-dives — improved tasks
> For each task with Verdict = Strong ↑ or Likely ↑: 1 short paragraph explaining what likely changed and why it worked (based on first-click shift and wrong-answer patterns in the CSV).
>
> ### Task deep-dives — remaining problems
> For each task with Verdict = Unclear or worse (failure rate still > 40%): 1 paragraph diagnosing the remaining confusion.
>
> ### Catastrophe analysis
> Did confidently-wrong answers go down overall? Flag any task where catastrophes increased despite accuracy gains — that's a warning sign.
>
> ### Recommendations for v3
> 3–5 IA changes still needed, ordered by residual failure rate.
>
> ### Methodology note
> Same as single-iteration template, plus: Bayesian Beta-Binomial model, Laplace prior Beta(c+1, n−c+1), 5,000 Monte Carlo draws, P(v2 better) = fraction of draws where v2 posterior > v1 posterior.

---

## Output tips

- The report renders cleanly in **Obsidian** as-is. `<details>` blocks collapse per-task sections.
- To use in a **slide deck**: copy the Executive Summary bullets as a title slide, paste the per-task comparison table into a single slide, and pull individual task deep-dives for detail slides. Each task `<details>` block maps to one slide.
- **Charts for slides:** Claude cannot produce chart images. After the report is generated, open `path-analysis.html` in your browser, load the merged CSV there, and use the **Copy PNG** buttons next to each pie chart and task overview card to copy clean images to your clipboard. Paste them manually into your slides alongside the text from the report.
- Do not ask for Dutch in the report language — participant quotes and labels are already in Dutch; the narrative around them should be in English or French.

---

## What NOT to ask Claude to do in this workflow

- **Don't ask Claude to create a Figma file or PowerPoint.** Figma MCP has no write support for slides; PPT generation creates large output with no preview, costs many tokens, and produces a file in whatever language the model defaults to.
- **Don't upload individual (unmerged) CSVs.** Use `merge-csv.html` first to produce one file, then upload that.
- **Don't ask Claude to re-export charts.** The exported `.md` already has all the numbers; `path-analysis.html` has the Copy PNG buttons for visuals.
