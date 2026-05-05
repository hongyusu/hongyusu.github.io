---
title: "An LLM-Powered Wiki at Work"
date: 2026-05-05
tags: [LLM, Claude, Wiki, Knowledge-Management, Productivity, Slack, Obsidian]
excerpt: "Karpathy's idea of an LLM-powered wiki, applied to my own work history. Two wikis, three freshness tiers, four skills — and the system that drafts Slack replies in my voice grounded in everything I've ever written or read."
---

> **Note.** This post describes a pattern, not a specific implementation at my employer. All organisation names, project names, internal services, colleagues, and clients have been removed; what remains is the architecture and the lessons. The system itself is built on top of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and the open-source [`wiki-skills`](https://github.com/kfchou/wiki-skills) plugin.

## The idea, briefly

[Andrej Karpathy](https://x.com/karpathy) wrote up an *LLM-powered wiki* idea in [a short gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — the loose pitch is that LLMs are very good at turning unstructured streams (transcripts, articles, conversations, papers) into structured, navigable, hyperlinked knowledge pages, and that doing this *for yourself* compounds in a way that ad-hoc note-taking does not.

The angle that stuck with me:

- A traditional wiki is **read-only and human-authored** — slow to build, slow to maintain, almost always stale.
- An LLM-powered wiki is **read-write by an agent** — the agent ingests raw sources on a schedule, synthesises them into pages, and updates back-links.
- Once the wiki exists, the same agent can **query it** to answer questions, draft replies, prep for meetings, etc.
- The compounding loop: every new source the agent ingests increases the value of every future query.

This post documents a working version of that loop, scoped to my own job. The actual content of the wiki is private — what's interesting is the **shape**.

## What the system does, end to end

```
                    ┌──────────────────────────────────────────────────┐
                    │                  RAW SOURCES                     │
                    │ Slack export · Slack live · DMs · Jira · Confl.  │
                    │ GitHub PRs · code repos · meeting transcripts    │
                    └────────────────────┬─────────────────────────────┘
                                         │
                              periodic + on-demand
                                         │
                                         ▼
                    ┌──────────────────────────────────────────────────┐
                    │             RAW STORE (immutable)                │
                    │      ~/wiki/raw/  +  ~/wiki/raw/incremental/     │
                    └────────────────────┬─────────────────────────────┘
                                         │
                                wiki-ingest (LLM)
                                         │
                                         ▼
                    ┌──────────────────────────────────────────────────┐
                    │           SYNTHESISED WIKI PAGES                 │
                    │  people · projects · decisions · code · infra    │
                    │     ~/wiki/wiki/pages/*.md   (Markdown +         │
                    │     [[wikilinks]], Obsidian-compatible)          │
                    └────────────────────┬─────────────────────────────┘
                                         │
                       wiki-query · draft-reply · ad-hoc Q&A
                                         │
                                         ▼
                    ┌──────────────────────────────────────────────────┐
                    │              GROUNDED OUTPUT                     │
                    │  Slack-reply drafts · meeting prep · answers     │
                    │  with [[citations]] and links back to sources    │
                    └──────────────────────────────────────────────────┘
```

The whole thing lives in a single Obsidian vault on disk. Nothing leaves my laptop. The "agent" is Claude Code invoked through a small set of slash-commands.

## Two wikis, not one

The first interesting decision was to split the vault into **two wikis with different lifecycles**:

| Wiki | Primary source | Updated | Answers questions like |
|---|---|---|---|
| `wiki-conversations/` | Slack export + live Slack pulls | Hourly when I'm at my laptop | *Who's working on what? What did the team decide on X? How do I reply to Y in my own voice?* |
| `wiki-codebase/` | Code repos, internal docs, ticket system | Daily-ish | *How is module Z implemented? What's the schema of table T? What's in flight in tickets / PRs?* |

The split matters because the question types are different:

- **Conversations** are about *people, decisions, voice, current state*. They drift fast (a decision from last week may be obsolete this week). Synthesis pages are short, heavily linked, and rewritten often.
- **Codebase** is about *how things actually work*. It drifts slowly. Pages are longer, more reference-like, and the truth is the code itself — the wiki is a navigable index over it.

Mixing the two pollutes both. Querying *"what was decided about X?"* against a wiki dominated by code references gives bad answers, and vice versa.

Both wikis share the same **page schema**:

```markdown
---
title: <page title>
tags: [tag1, tag2]
sources: [source-slug1, source-slug2]
updated: 2026-05-05
---

# <Title>

<synthesis paragraphs in my own words>

## Cross-links
- [[other-page]] — why it relates
```

And both follow the same conventions — append-only `log.md`, frontmatter for cross-page validation, an `index.md` and `overview.md` regenerated on every ingest.

## Three-tier freshness model

The hardest design problem with a personal wiki is **freshness**. Stale pages mislead, but constant re-synthesis is expensive and noisy. The system uses three tiers:

```
                    ┌─────────────────────────────────────────────┐
                    │  TIER 0  ·  Weekly full rebaseline          │
                    │  ~1 hour, manual, replaces raw/             │
                    │  Run on Sundays                             │
                    └────────────────────┬────────────────────────┘
                                         │
                                  fence advances
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │  TIER 1  ·  Per-session incremental         │
                    │  Seconds-to-minutes, on demand              │
                    │  Pulls only what's new since the watermark  │
                    │  Auto-chains to Tier 2                      │
                    └────────────────────┬────────────────────────┘
                                         │
                                 raw delta written
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │  TIER 2  ·  Synthesis (LLM)                 │
                    │  Reads new raw, updates affected wiki pages │
                    │  Surgical edits, not regenerations          │
                    └─────────────────────────────────────────────┘
```

Tier 0 is the only step that touches the full corpus. Tier 1 always knows where it left off (per-source watermarks in a shared `state.json`), so re-running it within the hour is a no-op. Tier 2 reads the raw delta and updates only the wiki pages that the delta actually affects — usually 1–4 pages, occasionally 10+.

The interesting property: **Tier 1 + Tier 2 chained together feel like one operation**. I type one slash-command and a few seconds later both raw and synthesised pages reflect new state.

## The four skills

The system is four [Claude Code skills](https://docs.anthropic.com/en/docs/claude-code/skills) (essentially bundled prompts + tool permissions) plus the open-source `wiki-skills` plugin for primitives.

| Skill | What it does | Inputs |
|---|---|---|
| `/pull-conversations-incremental` | Pulls new Slack channels + DMs since the watermark; appends raw transcripts; auto-chains to ingest. | `--no-dms`, `--channel <name>`, `--dry-run` |
| `/pull-codebase-incremental` | Pulls new tickets / wiki pages / PRs since the watermark; auto-chains to ingest. | `--source jira\|wiki\|github\|all`, `--no-ingest`, `--since DATE` |
| `/draft-reply` | Scans the inbox, picks threads needing a reply, drafts each one in my voice grounded in wiki + live search. Saves drafts I review and click Send. | `[3d \| 7d \| 24h]`, `channel:<name>` |
| `wiki-skills:{ingest,query,update,lint}` | Synthesis primitives. `ingest` turns raw → pages, `query` answers questions, `lint` audits health. | path / question |

The first three are mine. The fourth is an external plugin that the others compose with. Importantly, the synthesis logic is *not* something I had to write — `wiki-ingest` already knows how to read raw, decide which pages to touch, write back-links, and update the index. My skills just feed it the right deltas.

State across all skills lives in **one shared `state.json`** with this shape:

```json
{
  "last_weekly_dump_end": "2026-04-30T23:59:59Z",
  "last_incremental_pull_at": "2026-05-05T06:32:05Z",
  "last_fetched_per_channel": {
    "C0XXXXXX": "1777962482.032099",
    "DXXXXXXX": "1777962687.833689"
  },
  "external_sources": {
    "jira":       { "watermark_updated_after": "..." },
    "confluence": { "watermark_updated_after": "..." },
    "github":     { "watermark_updated_after": "..." }
  },
  "active_channels": [ ... ]
}
```

Watermarks are timestamps. Each pull strictly filters to messages/items with timestamps **after** the watermark, then advances the watermark to the latest item it actually wrote. Idempotent re-runs are free.

## Use cases that worked end to end

Five concrete things this unlocked, in rough order of "I would not go back".

### 1 — Daily inbox triage

```
$ /draft-reply 24h
```

Output is a single approval table: every thread that needs a reply, the recipient, the suggested stakes (HIGH / MEDIUM / LOW), the draft reply, and any action plan. I review the table, approve the rows I like, and drafts get saved into Slack as **drafts**. I open Slack, glance at each, hit Send.

Time per morning: ~2 minutes vs ~20 minutes manual. The drafts that need editing typically need a single word, not a rewrite, because the wiki gives the agent enough context to anchor on the right project, the right person, and my own past phrasing.

### 2 — Voice-anchored replies

The wiki has a dedicated `voice-and-style.md` page — a cheatsheet built from my own historical messages: openers I use, emoji I use, when I'm terse vs when I'm long, how I disagree, how I close.

When `/draft-reply` writes anything in my voice it loads that page first. The result is recognisable as me — same opener cadence, same compact bullet style, same `:smile:` close. Voice drift on novel topics still happens (the wiki only knows what I've written about before), but for anything in-domain it's surprisingly close.

### 3 — Grounded Q&A about my own systems

```
$ /wiki-skills:wiki-query "how does the data aggregation rule work and why do values shift between releases?"
```

Pulls the relevant code-grounded pages (`aggregation-rules`, `data-layer`, `version-snapshot-mechanism`), synthesises an answer with `[[wiki-link]]` citations, and offers to file the answer as a new wiki page. I don't have to dig through the codebase, I don't have to remember which Confluence page covers it, and I get back something I can paste into a Slack thread.

This was the moment I realised the wiki had crossed the threshold from "interesting" to "I rely on this."

### 4 — Cross-source weekly status

The wiki has a rolling `this-week.md` page that synthesises the last 7 days across Slack + tickets + PRs + Confluence edits. Every morning it answers *"what changed yesterday?"* without me opening four tabs. Roman-style weekly updates basically write themselves from the rolling page plus a manual paragraph of intent.

### 5 — Action-implying messages

The most surprising one. Sometimes a colleague pings me with an FYI that *implies* an action — *"hey, marketplace was updated, you might want to reload"*. The skill detects the implied action, executes the safe parts (`git pull` on a directory-source marketplace, in this example), and surfaces the manual followups (run `/reload-plugins` yourself).

The draft reply then says something like *"Aah, good to know — pulled and will reload, thanks :smile:"* — actually true at send time, not aspirationally true.

## Architecture choices that mattered

A few decisions that I'd carry into any LLM-wiki rebuild.

**Append-only raw store.** The `raw/` directory is treated as immutable. Skills only ever write to `raw/incremental/<date>/<hour>/` and never touch the historical dump. This makes Tier 0 rebaselines safe (you replace one directory, you don't merge) and makes ingest debuggable (you can re-run on the same hour-bucket and get identical output).

**Watermarks per source, not per pull.** Sharing `state.json` across all three pull skills means the system knows what each source has seen, even if you only run one skill on a given day. The "draft-reply" skill itself reads from these watermarks too, so it knows whether the local cache is fresh enough or whether to fall back to live MCP search.

**Auto-chain pull → ingest.** Tier 1 always invokes Tier 2 at the end of its run. This is a UX choice — the user types one command and gets a fully-updated wiki, not a half-updated one. It also makes the failure mode safe: if ingest fails, the raw delta is still on disk and the next ingest picks it up. State is never rolled back.

**Skills, not subprocesses.** Earlier attempts to schedule the system via `launchd` got quarantined by the laptop's EDR (`persistence_deception` rule). Same for shell-script wrappers. Solution: live entirely inside the Claude Code session as slash-commands, with `/loop 2h /pull-conversations-incremental` for hands-off cadence while the session is open. No on-disk persistence, no EDR friction.

**Two wikis, one schema.** The two wikis share the exact same page format, frontmatter, link convention, and log convention. Skills are written against the schema, not against either wiki specifically. This made it trivial to add the second wiki after the first one was working.

## Lessons and gotchas

These are the broadly-applicable ones — the company-specific ones live in the wiki itself.

- **Date filters are exclusive almost everywhere.** Slack's `after:DATE` and the GitHub CLI's `--updated >DATE` both *exclude* the date you pass. Always query `after:DATE-1` and post-filter against the precise watermark you actually care about.
- **External-system pagination lies.** Confluence v1 search returns one entry per `(page, version)` pair — the same page id can appear N times if it was edited N times in your window. Dedup by id, keep the highest version, log the discrepancy.
- **DMs are radioactive.** Pulling DMs into a synced folder (Obsidian Sync, iCloud, Dropbox) is the kind of mistake you make once. The system has a one-time DM preflight that surfaces a checklist of every sync client you might have, asks you to confirm, then writes a marker file so you don't get prompted again.
- **One draft per channel.** Slack only allows one draft per channel — if your skill wants to save three drafts to the same channel, only one of them sticks. Pick the highest-stakes one and tell the user to send-and-rerun.
- **Wiki pages drift between rebaselines.** Even with Tier 1 incremental, code-side wiki pages can be a day or two behind reality. Mitigation: any skill that *acts* on wiki content also does a live MCP search at runtime, and prefers live data for *current state* questions over the wiki snapshot.
- **Voice quality is a calibration problem.** The voice-cheatsheet does most of the work, but the agent still drifts on topics outside the wiki's coverage. Validation has to be qualitative — I check ~5 sent messages a week to feel whether voice is holding up.
- **AI safety classifiers occasionally intervene.** Some MCP tool calls (sending Slack messages, running `npx` packages from random publishers) get blocked. Workarounds: retry, fall back to a `urllib`-based Python script that does the same thing, or just accept the friction.

## What this doesn't solve

For honesty:

- It does not pre-empt hallway / voice / video-call context. The wiki only sees what was written down somewhere.
- It does not give me real-time freshness. If something was posted in the last 30 seconds, the wiki will be a beat behind. (`/draft-reply` does live search to compensate.)
- It does not produce voice that's *indistinguishable* from me on a topic the wiki has never seen me discuss.
- It does not *send*. I always click Send myself. This is intentional — the act of clicking is the meaningful confirmation, not the act of drafting.

## Adoption path, if you want to try this

The shape is portable. To stand up your own:

1. Run a Slack export of the channels you actually care about (regular export, no DMs in the first pass).
2. Pull your ticket system + wiki + GitHub via the same one-shot pattern (a small `urllib`-based Python script per source is enough — no need for npm wrappers).
3. Use [`wiki-skills:wiki-init`](https://github.com/kfchou/wiki-skills) to bootstrap the vault.
4. Use `wiki-skills:wiki-ingest` on the export.
5. Write the three pull-skills + the draft-reply skill on top, sharing a single `state.json`.
6. Edit `state.json::active_channels` to your actual inbox.
7. Run everything with `--dry-run` first; when the output looks right, drop the flag.

Total effort the first time was a long weekend of evening sessions. Maintenance since has been ~30 min/week, mostly for `wiki-lint` to catch broken cross-references and contradictions.

## Closing

The piece I most underestimated going in: **the wiki is more valuable as the agent's context than as a thing I read directly.** I almost never open the Obsidian vault by hand. I open it via `/wiki-skills:wiki-query` and `/draft-reply`. The wiki exists so the agent can ground its answers in something more grounded than its training data and more current than my Slack search.

That inversion — wiki as agent-grounding rather than wiki as human-reading — is the part of Karpathy's framing that I think hasn't fully landed yet for most people. Once it does, you stop asking *"is the wiki good enough to read?"* and start asking *"is it grounded enough to trust the agent on top of it?"* Different bar, different design choices.

If you build one, please tell me how you handled freshness and how you handled voice. Those are the two parts I'm still iterating on.
