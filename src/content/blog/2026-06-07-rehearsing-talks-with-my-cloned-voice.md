---
title: "Slides as HTML: html-anything, Rehearsal Mode, and My Cloned Voice"
date: 2026-06-07
tags: [HTML, Slides, html-anything, TTS, VoiceCloning, Chatterbox, ClaudeCode, Skills]
excerpt: "Skip PowerPoint: feed a markdown file to html-anything and get a self-contained HTML deck. Then layer on a rehearsal mode with a presenter window and speaker notes — and finally have those notes read aloud in a voice cloned from 80 seconds of my own speech. Plus the one-line setuptools trap that cost me an hour."
---

> **Note.** This is about a personal tooling workflow, not any specific work project. The example document is described abstractly; no organisation, client, or internal names appear. The pieces are off-the-shelf: [html-anything](https://github.com/nexu-io/html-anything), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), the open-source [Chatterbox](https://github.com/resemble-ai/chatterbox) TTS model, and the browser's Web Speech API.

## Slides, but as HTML

I stopped making presentations in PowerPoint or Keynote. I write them as **HTML** now, and I don't write the HTML by hand — I hand a markdown file to [**html-anything**](https://github.com/nexu-io/html-anything) and it produces the deck.

html-anything is an open-source collection of agent "skills" — 75 templates across 9 surfaces (decks, documents, posters, data reports, social cards…). Each template encodes a complete visual identity: typography, palette, layout, the lot. For slides there's a family of `deck-*` templates — a GitHub-dark tech-sharing style, an Apple-Keynote-ish one, a blueprint/architecture one, and so on. You pick the vibe; the template enforces the rest.

The output is a single self-contained `.html` file — 16:9 slides, arrow-key navigation, fonts and themes pulled from a CDN, **no build step and no runtime dependencies**. It opens in any browser and drops straight into a repo or a gist.

## The only input is a markdown file

This is the part I like most. I don't think in slides while drafting — I write a normal markdown document: headings, tables, code blocks, lists. That's the *only* material the deck is built from. The skill reads the markdown, decides the slide breaks, distils prose into claims-plus-evidence, and styles everything according to its visual rules. I write **zero CSS** and zero slide markup.

Practically, the request is one sentence:

> make a tech-sharing deck from `notes/foo.md`

and out comes `deck.html`. Same source markdown, different template name, completely different-looking deck. The markdown is the source of truth; the deck is a render of it.

## Rehearsal mode

A nice-looking deck isn't the same as being ready to *give* the talk. So I lean on the **presenter-mode** template, which adds the thing I actually care about: rehearsal.

Press `S` and a second browser window opens — the **presenter window** — showing the current slide, the next slide, the full speaker script, and a running timer. Arrow keys drive both windows; the audience window stays clean while I read my notes off the second screen.

The scripts live with each slide, in an `<aside class="notes">` block — 150–250 words written to be *spoken*, not read: short sentences, contractions, the key claim in bold. (That choice matters later, because those notes become the narration source verbatim.) Keyboard map, for the curious: `S` presenter · `T` theme · `←/→` navigate · `O` overview · `F` fullscreen · `R` reset timer.

## Reading the script aloud — the free way

If the notes *are* the words I'm going to say, why am I the one reading them during practice? The browser already ships a text-to-speech engine — the **Web Speech API** — so I wired a read-aloud control into the presenter window: play/pause on `P`, a speed slider, a voice picker. It even fires a `boundary` event on every word, which lets me highlight the script karaoke-style as it speaks.

Free, offline, zero setup. For most rehearsal it's genuinely enough. But the macOS system voices, while fine, are unmistakably *system voices*. I wanted mine.

## My own voice — the TTS landscape in 2026

Before writing code I checked where text-to-speech actually stands. The blind-test [TTS Arena](https://huggingface.co/spaces/TTS-AGI/TTS-Arena-V2) leaderboards are the honest read, since naturalness is subjective. What I learned:

- The **top of the board is all closed APIs** — Inworld, Google's Gemini TTS, ElevenLabs, MiniMax's Speech models. Great quality, but you rent them, your audio goes to their servers, and they bill per character.
- **OpenAI has TTS** (`gpt-4o-mini-tts` is even *steerable* — you can instruct tone), but it **can't clone an arbitrary voice** — preset voices only, by design.
- **MiniMax open-weights its language models but not its speech models.** So "is MiniMax open source?" is *yes for the LLMs, no for TTS.*

For cloning my own voice, locally and for free, the interesting column is the open-weight one: Fish Speech, XTTS-v2, **Chatterbox**, F5-TTS, OpenVoice. The standout is [**Chatterbox**](https://github.com/resemble-ai/chatterbox) from Resemble AI — MIT-licensed, clones from about **five seconds** of reference audio, and in the vendor's blind test beat ElevenLabs (~65% preference). Open, local, commercial-safe. Sold.

## Cloning the voice

I recorded ~80 seconds of myself talking normally and normalised it to a clean mono WAV:

```bash
ffmpeg -i recording.m4a -ac 1 -ar 24000 -af loudnorm voice_sample.wav
```

Chatterbox itself is a few lines — point it at the reference clip and any text:

```python
from chatterbox.tts import ChatterboxTTS

model = ChatterboxTTS.from_pretrained(device="mps")  # Apple GPU
wav = model.generate(text, audio_prompt_path="voice_sample.wav")
```

A render script pulls the `<aside class="notes">` text out of the deck, chunks each slide's script on sentence boundaries, generates audio per chunk, stitches them with short silences, and writes `audio/slide-01.mp3 …` next to the deck. On Apple's MPS backend it's ~1–2 minutes per slide; a dozen slides gave me about **14 minutes of narration in my own voice**.

Back in the presenter window I added a source dropdown: **Browser voice** (live, with word-highlight) or **My voice (recorded)** (plays the rendered mp3s). Tick *auto* and it reads each slide as you advance — a hands-free teleprompter that sounds like me.

## The trap: one line that cost an hour

The first real run crashed inside model load:

```
TypeError: 'NoneType' object is not callable
```

…on Chatterbox's watermarker. The trail: Chatterbox uses `perth` for watermarking, `perth` imports `pkg_resources`, and **`setuptools` 81+ removed `pkg_resources`**. A fresh install pulls the newest setuptools, the import silently fails, the watermarker class becomes `None`, and construction blows up far from the real cause. The fix is a single pin:

```
setuptools<81
```

Writing it down here so the next person Googling that error lands on it.

## Make it one command, forever

Doing this once is a project; doing it every time is a chore. So I packaged the whole flow — html-anything deck + rehearsal mode + narration — as a **Claude Code skill**. The fragile 700-line deck runtime (navigation, presenter window, both read-aloud engines, themes) is frozen as two template halves, a head and a tail, so the model never regenerates it; it only writes the slide sections in between and concatenates. The narration script ships alongside, and the skill knows where my voice sample lives.

The entire pipeline now collapses to a sentence:

> make a narrated deck from `notes/foo.md` in my voice

and out comes `deck.html` plus an `audio/` folder, ready to rehearse. New talk, new markdown file, same one-liner.

## What I'd tell past me

- **Author in markdown, render to slides.** Keeping the markdown as the single source — and letting a template own the design — is the whole trick. I never touch CSS.
- **Start with the browser's TTS.** Free, offline, often enough; reach for cloning only when you specifically want *your* voice.
- **Read the leaderboards, but filter by license.** "Best-sounding" and "best-for-me" are different questions; "open-weight + self-hostable" is a column the rankings don't show.
- **Pin `setuptools<81`** if you touch the current open-source TTS stack.
- **Package the workflow, not just the output.** The deck is nice; the one-line skill that makes *every future* deck is what actually changed my habits.
