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

To request a written cross-iteration analysis from Claude, upload or paste both merged CSVs and say:

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
