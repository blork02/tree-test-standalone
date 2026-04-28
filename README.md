# HR Service Desk – Tree Test (Standalone)

A self-contained, client-side tree test for evaluating the navigation structure of an HR service desk portal. No backend, no external dependencies — open `index.html` in a browser and go.

## Live URLs (GitHub Pages)

| Purpose | URL |
|---|---|
| Participant test — NL | https://blork02.github.io/tree-test-standalone/?lang=nl |
| Participant test — FR | https://blork02.github.io/tree-test-standalone/?lang=fr |
| Admin / content editor | https://blork02.github.io/tree-test-standalone/admin.html |
| CSV merger | https://blork02.github.io/tree-test-standalone/merge-csv.html |
| Path analysis | https://blork02.github.io/tree-test-standalone/path-analysis.html |
| Test data generator | https://blork02.github.io/tree-test-standalone/generate-test-data.html |

## What it does

Participants complete a full session in one sitting:

1. **Language selector** — FR or NL (skip with `?lang=nl` URL parameter)
2. **Participant ID** — pre-filled with a random code (e.g. `P-3847`), editable
3. **Instructions** — brief explanation of the task
4. **8 tree-test tasks** — presented in randomised order, each with:
   - A scenario description
   - The full category tree to navigate
   - A breadcrumb showing the current selection
   - A confirm button
   - A post-task confidence scale (1–5) and optional comment
5. **Post-study questionnaire** — overall ease rating, hardest categories (multiselect), open-text fields
6. **Download screen** — participant downloads a CSV of their results

All data stays in the browser. Nothing is sent to a server.

## Files

| File | Purpose |
|---|---|
| `index.html` | Participant-facing test |
| `app.js` | Session state machine |
| `config.js` | All editable content (tree, tasks, i18n strings, result emails) |
| `styles.css` | Styles for `index.html` |
| `admin.html` | Visual config editor — edit tree, tasks, instructions, export new `config.js` |
| `merge-csv.html` | Drag-and-drop CSV merger — combine individual participant files into one |
| `path-analysis.html` | Path explorer — upload merged CSV to visualise navigation flows per task |
| `generate-test-data.html` | Fake participant generator for testing `path-analysis.html` |

## Running locally

Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari). No build step needed.

To pre-select a language and skip the language selector, append `?lang=nl` or `?lang=fr` to the URL:

```
file:///path/to/index.html?lang=nl
```

Or serve locally:

```bash
python3 -m http.server 8080
```

## Customising `config.js`

### Tasks

Each task in `CONFIG.tasks` has:

```js
{
  id: 'task1',               // unique identifier used in CSV output
  scenario_nl: 'Dutch scenario text shown to the participant.',
  scenario_fr: 'French scenario text.',
  correct_nl:  'nl_node_id', // node ID of the expected answer in the NL tree
  correct_fr:  'fr_node_id', // node ID of the expected answer in the FR tree
}
```

Add, remove, or reorder tasks here. The session always runs **all** tasks in the array in a randomised order.

### Trees

`CONFIG.trees.nl` is complete. `CONFIG.trees.fr` has the same structure with empty labels — fill them in before running French sessions. Each node:

```js
{ id: 'unique_id', label: 'Visible label' }                          // leaf
{ id: 'unique_id', label: 'Visible label', children: [ ... ] }       // branch
```

Top-level children of the tree root become the options in the "hardest categories" multiselect on the post-study screen.

### i18n strings

All UI text is in `CONFIG.i18n.fr` and `CONFIG.i18n.nl`. The `instructionsBodyHtml` value accepts HTML (injected directly, not escaped). All other values are plain text.

## CSV output format

Each participant produces one CSV. Rows: one per task, plus a `pre_test` row and a `post_study` row.

### Task rows (`task_id` = task1, task2, …)

| Column | Description |
|---|---|
| `participant_id` | Entered or auto-generated ID |
| `language` | `nl` or `fr` |
| `task_id` | Task identifier from `config.js` |
| `task_order` | Position in this participant's randomised sequence |
| `scenario_text` | The scenario shown to the participant |
| `path_events` | Navigation log as `OPEN:node_id \| SELECT:node_id \| …` (machine-parseable) |
| `path_labels` | Same log with human-readable labels, `>` separated |
| `first_click` | Node ID of the first leaf the participant clicked (first answer attempt) |
| `first_click_correct` | `true`/`false` — whether the first leaf click matched the correct answer |
| `first_opened` | Label of the Tier-1 category the participant opened first (the tree-test "first click" metric) |
| `final_answer` | Node ID of the confirmed selection |
| `final_answer_path` | Human-readable path of the confirmed selection |
| `n_backtrack` | How many times they changed their leaf selection before confirming (0 = went straight) |
| `correct` | `true`/`false` — whether the final answer matched the correct answer |
| `time_seconds` | Seconds from task display to confirm click |
| `confidence` | Post-task confidence rating 1–5 |
| `comment` | Participant's free-text comment for this task |
| `randomisation_seed` | Integer seed used to generate this session's task order |

### Pre-test row (`task_id` = `pre_test`)

The columns `pretest_computer`, `pretest_smartphone`, `pretest_intranet_webe`, `pretest_hr_contact`, `pretest_hr_servicedesk` contain the frequency label the participant selected for each question. All other task columns are empty.

### Post-study row (`task_id` = `post_study`)

| Column | Description |
|---|---|
| `ease` | Overall ease rating 1–5 |
| `structure_words` | Pipe-separated list of "hardest category" label selections |
| `structure_other` | Free-text "other" for hardest category |
| `other_comments` | Open-ended post-study comment |

All task-level columns are empty in this row.

## Deployment

Copy all files to any static host — GitHub Pages, Netlify, an intranet share, etc. No server-side processing is required. Participants download their own CSV at the end of the session and share it with the study coordinator by email or file upload.
