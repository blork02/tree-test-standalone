# Tree Test — Analysis Guide for Claude

## How to request analysis

In a new Claude conversation, upload or paste all participant CSV files, then say:

> "Analyze these tree test CSVs using the protocol in ANALYSIS.md."

Or paste the **Analysis Protocol** section below directly into your message.

---

## Analysis Protocol

You are analyzing tree test CSV data collected with the HR Service Desk tree test tool.

**Input:** One or more CSV files. Each file is one participant. Rows with `task_id = pre_test` or `post_study` are not task rows. Filter them out for task analysis; use them for questionnaire analysis.

**Produce the following, in order:**

### 1. Overview table

One row per task (across all participants). Columns:

| task_id | N | % correct | % first-click correct | median time (s) | mean confidence |

Sort by task_id.

### 2. Path flow — per task

For each task, show:

```
TASK [task_id] — "[scenario_text, first 80 chars]"
N=[total] | Correct=[X/N, XX%] | First-click correct=[X/N, XX%] | Median time=[Xs] | Mean confidence=[X.X]

FIRST OPENED (which Tier-1 branch did participants explore first?):
  [first_opened label]  N=X (XX%)  →  correct: X/X (XX%)
  [first_opened label]  N=X (XX%)  →  correct: X/X (XX%)
  (no branch opened)    N=X (XX%)

WRONG ANSWERS (final_answer where correct=false, by frequency):
  [final_answer_path]  N=X
  [final_answer_path]  N=X

BACKTRACK rate: X% of participants changed selection at least once (n_backtrack > 0)
```

To reconstruct the path flow, parse `path_events` by splitting on ` | `. Each token is `TYPE:node_id`. Group participants by their sequence of OPEN events (the exploration path) before their final SELECT.

### 3. First-answer-attempt analysis — per task

> **Distinction:** `first_opened` (used in §2) = the Tier-1 *category* a participant navigated into first — the true "first click" metric in tree testing. `first_click` (used here) = the *leaf node* a participant selected first as their answer, which may differ from their final confirmed answer if they backtracked.

For each task, a frequency table of `first_click` values (first leaf selected, not necessarily confirmed):

| first_click node ID | readable label | N | % | correct? |
|---|---|---|---|---|

Derive the readable label from `final_answer_path` context or the tree config. Mark the correct answer (matches `correct_nl` / `correct_fr` in config) with ✓.

### 4. Post-study analysis

From rows where `task_id = post_study`:

- **Ease rating distribution** (1–5): count and % per value, mean
- **Perception adjectives** (`structure_words` column, pipe-separated): count mentions per adjective, sorted descending
- **Perception adjectives — open-ended** (`structure_other`): list verbatim with participant ID, one per respondent
- **Open comments** (`other_comments`): list verbatim, one per participant

### 5. Pre-test profile (optional, if data present)

From rows where `task_id = pre_test`, columns `pretest_computer` through `pretest_hr_servicedesk` hold the frequency label the participant chose. Summarize as a frequency table per question.

---

## CSV column reference

| Column | Type | Description |
|---|---|---|
| `participant_id` | string | Participant code (e.g. `P-3847`) |
| `language` | `nl`/`fr` | Session language |
| `task_id` | string | Task identifier; also `pre_test` and `post_study` |
| `task_order` | int | Position in this participant's randomised task sequence |
| `path_events` | string | Navigation log: `OPEN:node_id \| SELECT:node_id \| ...` — pipe-separated, OPEN = branch expanded, SELECT = leaf clicked |
| `path_labels` | string | Same as path_events but with human-readable labels (`A > B > C` format) |
| `first_click` | node_id | Node ID of the first leaf the participant clicked |
| `first_click_correct` | bool | Whether first_click matched the correct answer |
| `first_opened` | string | Label of the Tier-1 category the participant opened first |
| `final_answer` | node_id | Node ID of the confirmed final selection |
| `final_answer_path` | string | Human-readable path of final answer (`A > B > C`) |
| `n_backtrack` | int | How many times they changed leaf selection (0 = went straight) |
| `correct` | bool | Whether final_answer matched the correct answer |
| `time_seconds` | int | Seconds from task display to confirm click |
| `confidence` | 1–5 | Post-task confidence rating |
| `comment` | string | Participant's free-text comment for this task |
| `randomisation_seed` | int | Seed used to generate this participant's task order |
| `pretest_computer` … `pretest_hr_servicedesk` | string | Pre-test frequency answers (one column per questionnaire row) |
| `ease` | 1–5 | Post-study overall ease rating |
| `structure_words` | string | Pipe-separated list of "hardest category" selections |
| `structure_other` | string | Free-text "other" for hardest category |
| `other_comments` | string | Post-study open comments |

---

## Cross-iteration comparison (v1 vs v2)

When you have loaded two iterations in `path-analysis.html`, a **↔ Compare** tab appears automatically. It computes:

- **Accuracy shift** per task: v1 % correct → v2 % correct, delta in percentage points
- **P(v2 better)**: Bayesian Beta-Binomial probability that v2 accuracy is genuinely higher. Uses a Laplace prior Beta(c+1, n−c+1) for each iteration, draws 5,000 Monte Carlo samples, and counts how often v2 > v1.
- **First-click correct shift**: Δ pp in the % of participants whose first leaf click was correct
- **Catastrophe delta**: change in the count of confidently-wrong participants (correct=false AND confidence ≥ 4)

**Reading the confidence badge:**

| Badge | Meaning |
|---|---|
| Strong ↑ (P ≥ 0.95) | Very likely improved |
| Likely ↑ (P ≥ 0.75) | Probably improved |
| Unclear (P 0.40–0.74) | Inconclusive — sample too small or effect too small |
| Likely ↓ (P ≤ 0.25) | Probably regressed |
| Strong ↓ (P ≤ 0.05) | Very likely regressed |

Tasks are sorted by P(v2 better) descending so the clearest improvements appear first.

> The Bayesian model naturally handles unequal sample sizes across iterations. A small N produces a wide posterior, which pushes P(improved) toward 0.50 and shows as "unclear" — the correct behaviour when there is not enough data to draw a conclusion.

### Reading the exported comparison file

When you export from the Compare tab in `path-analysis.html`, you receive a `tree-test-comparison-YYYY-MM-DD.md` file. Its structure:

| Section | What it tells you |
|---|---|
| YAML frontmatter | Iteration labels, export date |
| Overall accuracy | Aggregate correct rate v1 → v2, delta pp across all tasks combined |
| Summary table | Count of improved / inconclusive / regressed tasks |
| Per-task comparison table | Row per task: accuracy v1/v2, Δ pp, P(v2 better), verdict, first-click v1/v2, FC Δ pp, catastrophe count v1→v2 |
| Task scenarios (reference) | Full scenario text per task ID — use this to name tasks in your write-up |
| Methodology | Model description for citation |

**Column-by-column guide for the per-task table:**

- **Accuracy v1 / v2** — % of participants who selected the correct final answer in each iteration.
- **Δ pp** — raw difference in percentage points (v2 − v1). A positive value means more participants succeeded in v2.
- **P(v2 better)** — Bayesian probability that the *true* underlying accuracy rate improved, not just the sample. A high P with a small Δ pp means even the small gain is likely real; a large Δ pp with P near 50% means the sample was too small to be confident.
- **Verdict** — plain-language label derived from P: Strong ↑ (≥ 95%), Likely ↑ (≥ 80%), Unclear, Likely ↓ (≤ 20%), Strong ↓ (≤ 5%).
- **First-click v1 / v2 and FC Δ pp** — same as accuracy metrics but for first-click correct. Improvement here means participants are finding the right branch faster, even if their final accuracy hasn't fully caught up yet.
- **Catastrophes v1→v2** — count of wrong-yet-confident answers (correct=false AND confidence ≥ 4). A drop means the redesign reduced genuinely misleading labels. An increase is a warning sign even if overall accuracy went up.

**How to interpret common patterns:**

| Pattern | Interpretation |
|---|---|
| High Δ pp, Strong ↑ | Clear improvement — the IA change worked |
| High Δ pp, Unclear | Change looks promising but N too small to confirm — re-test |
| Low Δ pp, Strong ↑ | Small but reliable gain — likely a label polish, not a structural fix |
| Accuracy up, catastrophes up | More people correct, but the *wrong* group became more confident — check the wrong-answer path |
| FC Δ up, accuracy flat | Participants now navigate into the right branch first but still pick the wrong leaf — the tier-1 label is fixed, a leaf label is still confusing |
| Regressed task | Something in the redesign introduced a new confusion — review what changed in that branch |

### Requesting a written analysis from the comparison file

Upload or paste the exported `tree-test-comparison-YYYY-MM-DD.md` into a Claude conversation and say:

> "Analyze this tree test comparison report. Identify which tasks clearly improved (Strong ↑ or Likely ↑), which regressed, and which are inconclusive. For each improved task, describe what the accuracy shift and P(v2 better) value mean in plain language. Flag any tasks where catastrophes increased despite accuracy gains. Summarise the overall picture in 2–3 sentences, then list the tasks still needing attention for v3, ordered by residual failure rate."

Or, if you want to compare the two individual iteration reports side-by-side instead:

> "Compare these two iterations of the tree test. For each task, report: v1 accuracy, v2 accuracy, delta pp, and P(v2 better). Flag tasks where P ≥ 0.75 as improved and P ≤ 0.25 as regressed. Summarise the overall accuracy shift and highlight which tasks changed most. Also note first-click correct shift and catastrophe delta per task."

---

## Path visualization tips

To reconstruct a Google Analytics-style flow for a given task:

1. Filter rows to `task_id = [task]`
2. Parse `path_events`: split on ` | `, each token is `OPEN:id` or `SELECT:id`
3. The sequence of OPEN tokens = the exploration path through the tree
4. The final SELECT token = their answer
5. Group participants by their first OPEN token (= `first_opened`) to see which Tier-1 category they explored first
6. Within each group, trace the full OPEN sequence to see which subcategories they drilled into

For a compact text diagram, show:
```
[Tier-1 label] (N=X, XX%)
  ├─ opened [Subcategory] (N=X) → correct: X/X
  │     selected [Leaf] ✓  N=X
  │     selected [Leaf] ✗  N=X
  └─ selected directly [Leaf] ✗  N=X
```
