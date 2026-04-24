# HR Service Desk – Tree Test (Standalone)

A self-contained, client-side tree test for evaluating the navigation structure of an HR service desk portal. No backend, no external dependencies — open `index.html` in a browser and go.

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

## Running locally

Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari). No build step needed.

To pre-select a language and skip the language selector, append `?lang=nl` or `?lang=fr` to the URL:

```
file:///path/to/index.html?lang=nl
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

One row per task, plus one summary row for the post-study questionnaire. Columns:

| Column | Description |
|---|---|
| `participant_id` | Entered or auto-generated ID |
| `language` | `nl` or `fr` |
| `task_id` | Task identifier from `config.js` |
| `task_order` | Position in this participant's randomised sequence (1–8) |
| `scenario_text` | The scenario shown to the participant |
| `path_taken` | Full navigation log (`▸ opens` and `○ selections`), pipe-separated |
| `first_click` | Node ID of the first leaf the participant clicked |
| `first_click_correct` | `true`/`false` — whether the first click matched `correct_xx` |
| `final_answer` | Node ID of the confirmed selection |
| `final_answer_path` | Human-readable path of the confirmed selection |
| `correct` | `true`/`false` — whether the final answer matched `correct_xx` |
| `time_seconds` | Seconds from task display to confirm click |
| `confidence` | Confidence rating 1–5 |
| `comment` | Participant's free-text comment for this task |
| `randomisation_seed` | Integer seed used to generate this session's task order |

The post-study row has `task_id = "post_study"`. Its `confidence` column holds the overall ease rating (1–5) and its `comment` column holds a JSON object:

```json
{
  "ease": 4,
  "hardestCategories": ["nl_loopbaan", "nl_gezondheid"],
  "missingOrPoorlyNamed": "...",
  "otherComments": "..."
}
```

## Deployment

Copy the four files (`index.html`, `app.js`, `config.js`, `styles.css`) to any static host — GitHub Pages, Netlify, an intranet share, etc. No server-side processing is required.

To generate a shareable link for a specific language:

```
https://your-host/index.html?lang=nl
```

Participants download their own CSV at the end of the session and share it with the study coordinator by email or file upload.
