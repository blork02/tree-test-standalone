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

### 3. First-click analysis — per task

For each task, a frequency table of `first_click` values:

| first_click node ID | label (from final_answer_path context) | N | % | correct? |
|---|---|---|---|---|

Mark the correct first_click (matches `correct_nl` / `correct_fr` in config) with ✓.

### 4. Post-study analysis

From rows where `task_id = post_study`:

- **Ease rating distribution** (1–5): count and % per value, mean
- **Hardest categories** (`structure_words` column, pipe-separated): count mentions per category, sorted descending
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
