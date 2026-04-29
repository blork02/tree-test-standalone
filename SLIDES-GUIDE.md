# UX Report Slides — Guide

How to turn an exported tree test report into a presentation using Claude and Figma.

## Step 1 — Export the report

In `path-analysis.html`, after uploading your merged CSV, click **↓ Export Report**. This downloads a Markdown file (`tree-test-report-YYYY-MM-DD.md`) containing:

- Overview table (all tasks: accuracy, time, confidence, catastrophes)
- Per-task breakdown: correct answer, outcomes, first-opened distribution, wrong answers, backtrack rate, catastrophes with participant detail, open comments
- Post-study analysis: ease ratings, hardest categories, open comments
- Pre-test profile: participant digital literacy scores

## Step 2 — Generate slides with Claude

Open a new Claude conversation and attach the exported `.md` file. Then use this prompt:

---

> You are a UX researcher presenting findings from a tree test study on an HR service desk navigation. I've attached the full analysis report.
>
> Please:
>
> 1. **Synthesize the key findings** across all tasks — identify which categories caused the most confusion, what the catastrophe data reveals, and any patterns across languages or participant segments.
>
> 2. **Generate a slide deck structure** for a UX research readout presentation (approx. 12–16 slides). For each slide provide:
>    - Slide title
>    - Key message (1 sentence, written as an insight, not a description)
>    - Supporting data points to show (exact numbers from the report)
>    - Suggested visual (bar chart / pie / flow diagram / quote)
>    - Speaker notes (2–3 sentences of context or recommendation)
>
> 3. **Recommend 3–5 actionable IA changes** based on the data, ordered by severity.
>
> The audience is the HR service desk product team — they care about completion rates, user confusion, and prioritization. Skip methodology details; lead with impact.

---

## Step 3 — Push slides to Figma

Once Claude has produced the slide structure, continue the same conversation:

> Now create these slides in my Figma file using the Figma tool. Use the existing slide template in the file — keep the layout, typography, and color system as-is. One frame per slide. For any chart or data visualization, render it as a simple vector shape using the brand colors (blue = #1d4ed8, green = #16a34a, red = #dc2626).

Provide the Figma file URL when prompted. Claude will use the Figma MCP to write directly into your file.

**Requirements for this to work:**
- Claude must be running with the Figma MCP enabled (available in Claude.ai with Figma connected, or via a local Claude Code session with the Figma MCP configured)
- Your Figma file must have edit access for the connected account
- A slide template frame should already exist in the file — Claude will replicate its structure

## Suggested slide structure

| # | Slide | Key content |
|---|---|---|
| 1 | Title | Study name, date, N participants |
| 2 | Study setup | Tasks, tree, languages, method |
| 3 | Overall accuracy snapshot | Overview table as a visual |
| 4 | Top finding 1 | Highest-failure task + why |
| 5 | Top finding 2 | Catastrophe analysis — who was confidently wrong |
| 6–N | Per-task deep dives | One slide per problematic task |
| N+1 | First-click patterns | Which categories attract the wrong first click |
| N+2 | Post-study ease | Rating distribution + hardest categories |
| N+3 | Participant quotes | Selected verbatim comments |
| N+4 | Recommendations | 3–5 IA changes, prioritized |
| N+5 | Next steps | Proposed iterations or follow-up study |

## Tips

- **Catastrophes are your lead story.** A participant who was wrong AND confident is more damaging than one who was wrong and knew it. These indicate genuinely misleading labels.
- **First-opened data beats final accuracy** for IA diagnosis. Even if a task scores 70% correct, if most participants opened the wrong branch first, the label is confusing.
- **Copy PNG** (the button next to each pie chart in path-analysis.html) produces a clean image you can paste directly into slides without re-creating the chart.
